#define _CRT_SECURE_NO_WARNINGS

#ifdef WINDOWS
#include <windows.h>
#else
#include <cstring>
#endif
#include <stdio.h>
#include <stdlib.h>
#include "dtypes.h"
#include "xycrypt.h"


enum PkxSizes {

    SIZE_PARTY_PKX      = 260,
    SIZE_BOX_PKX        = 232,
    SIZE_PKX_UNCRYPT    = 8,
    SIZE_PKX_CRYPT_LEN  = SIZE_BOX_PKX - SIZE_PKX_UNCRYPT,
    SIZE_PKX_BLK        = 56,
    SIZE_PKX_PARTY_DATA = 28

};


struct Rnd {

    u32 mul;
    u32 add;
    u32 rmul;
    u32 radd;

};


const char orders[24][4] = {
    0, 1, 2, 3,
    0, 1, 3, 2,
    0, 2, 1, 3,
    0, 3, 1, 2,
    0, 2, 3, 1,
    0, 3, 2, 1,
    1, 0, 2, 3,
    1, 0, 3, 2,
    2, 0, 1, 3,
    3, 0, 1, 2,
    2, 0, 3, 1,
    3, 0, 2, 1,
    1, 2, 0, 3,
    1, 3, 0, 2,
    2, 1, 0, 3,
    3, 1, 0, 2,
    2, 3, 0, 1,
    3, 2, 0, 1,
    1, 2, 3, 0,
    1, 3, 2, 0,
    2, 1, 3, 0,
    3, 1, 2, 0,
    2, 3, 1, 0,
    3, 2, 1, 0,
};


inline void InitRnd(Rnd* r);
inline u16 CryptRNG(u32* data, Rnd* r);
void CryptPkx(u32* pkx, u32* key, u32 len, Rnd* cr);
inline u16 CalcPkxChecksum(u16* pkx, u32 len);
bool VerifyPkxChecksum(u32* pkx, u16 currentSum, u32 len);
void FixPkxChecksum(u32* pkx, u32 len);
inline u32 GetShuffleType(u32 pid);
void UnshufflePkx(u32* pkx_in, u32* pkx_out);
inline void SetUncryptedDataEqual(u32* pkx_in, u32* pkx_out);

int xy_decrypt(char* in_pkx, int in_pkx_length, char* out_pkx)
{
    u32 box_pkx[SIZE_BOX_PKX / sizeof(u32)];
    u32 outbox_pkx[SIZE_BOX_PKX / sizeof(u32)];
    u32 party_data[SIZE_PKX_PARTY_DATA / sizeof(u32)];
    
    Rnd xypkx;

    InitRnd(&xypkx);

    memcpy(box_pkx, in_pkx, in_pkx_length);

    if ((in_pkx_length != SIZE_PARTY_PKX) && (in_pkx_length != SIZE_BOX_PKX))
    {
        printf("Pkx is the wrong size.");
        return 0;
    }

    u32 decryptKey = box_pkx[0];    // key is now pid, not checksum

    CryptPkx(&box_pkx[2], &decryptKey, SIZE_PKX_CRYPT_LEN, &xypkx);
    UnshufflePkx(box_pkx, outbox_pkx);
    SetUncryptedDataEqual(box_pkx, outbox_pkx);

    if (!VerifyPkxChecksum(&box_pkx[2], (box_pkx[1] >> 16) & 0xFFFF, SIZE_PKX_CRYPT_LEN))
    {
        printf("Checksum failed.");
        return 0;
        //printf("Checksum failed.  Fixing.\n\n");
        //FixPkxChecksum(box_pkx, SIZE_PKX_CRYPT_LEN);
    }

    if (in_pkx_length == SIZE_PARTY_PKX)
    {

        decryptKey = box_pkx[0];

	memcpy(in_pkx + SIZE_BOX_PKX, party_data, SIZE_PKX_PARTY_DATA);

        CryptPkx(party_data, &decryptKey, SIZE_PKX_PARTY_DATA, &xypkx);
    }

    memcpy(out_pkx, outbox_pkx, SIZE_BOX_PKX);

    if (in_pkx_length == SIZE_PARTY_PKX)
    {
	memcpy(out_pkx + SIZE_BOX_PKX, party_data, SIZE_PKX_PARTY_DATA);
    }

    return in_pkx_length;
}


void CryptPkx(u32* pkx, u32* key, u32 len, Rnd* cr)
{
    u16* epkx = (u16*)pkx;
    u16 cryptKey = 0;
    
    for (u32 i = 0; i < len / 2; ++i)
    {
        cryptKey = CryptRNG(key, cr);
	printf("value %d, %d, %d, %d\n", epkx[i], cryptKey, epkx[i] ^ cryptKey, *key);
        epkx[i] ^= cryptKey;
    }
}


inline void InitRnd(Rnd* r)
{
    r->mul = 0x41C64E6D;
    r->add = 0x6073;
    r->rmul = 0xEEB9EB65;
    r->radd = 0xA3561A1;
}


inline u16 CryptRNG(u32* data, Rnd* r)
{
   *data = ((*data * r->mul) + r->add);
   return (*data >> 16);
}


inline u16 CalcPkxChecksum(u16* pkx, u32 len)
{
    u16 sum = 0;

    for (u32 i = 0; i < len / 2; ++i)
    {
        sum += pkx[i];

    }
    return sum;
}


bool VerifyPkxChecksum(u32* pkx, u16 currentSum, u32 len)       // this accepts the pkx starting @ the blocks
{
    u16* epkx = (u16*)pkx;

    u16 testSum = CalcPkxChecksum(epkx, len);

    printf("checksum %d, %d\n", currentSum, testSum);
    if (testSum == currentSum)
    {
        return true;
    }
    else
    {
        return false;
    }
}


void FixPkxChecksum(u32* pkx, u32 len)      // this accepts the whole pkx because it needs access to data before the blocks start
{
    u16* epkx = (u16*)pkx;

    u16 newSum = CalcPkxChecksum(&epkx[4], len);

    epkx[3] = newSum;
}


inline u32 GetShuffleType(u32 pid)      // same as it was before
{
    return ((pid & 0x3E000) >> 0xD) % 24;
}


void UnshufflePkx(u32* pkx_in, u32* pkx_out)
{
    u8* eipkx = (u8*)pkx_in;
    u8* eopkx = (u8*)pkx_out;

    u32 blockOrder = GetShuffleType(pkx_in[0]);

    for (u32 i = 0; i < 4; ++i)
    {
        memcpy(eopkx + SIZE_PKX_UNCRYPT + (SIZE_PKX_BLK * i), eipkx + SIZE_PKX_UNCRYPT + (SIZE_PKX_BLK * orders[blockOrder][i]), SIZE_PKX_BLK);
    }
}

inline void SetUncryptedDataEqual(u32* pkx_in, u32* pkx_out)
{
    for (u32 i = 0; i < 2; ++i)
    {
        pkx_out[i] = pkx_in[i];
    }
}


/*
pkx format:

u32 pid
u16 sanity
u16 checksum
56*4b pokedata blocks, shuffled same as always
28b party data 

*/
