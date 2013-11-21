#define _CRT_SECURE_NO_WARNINGS

#ifdef WINDOWS
#include <windows.h>
#else
#include <cstring>
#endif
#include <stdio.h>
#include <stdlib.h>
#include "dtypes.h"


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

int main(int argc, char** argv)
{
    FILE* in_pkx;
    FILE* out_pkx;
    u32 box_pkx[SIZE_BOX_PKX / sizeof(u32)];
    u32 outbox_pkx[SIZE_BOX_PKX / sizeof(u32)];
    u32 party_data[SIZE_PKX_PARTY_DATA / sizeof(u32)];
    
    Rnd xypkx;

    InitRnd(&xypkx);

    /*
	typedef unsigned char                   u8;
typedef unsigned short int              u16;
typedef unsigned long int               u32;
typedef unsigned long long int  u64;

typedef signed char                             s8;
typedef signed short int                s16;
typedef signed long      int            s32;
typedef signed long long int    s64;

typedef float                                   f32;
typedef double                                  f64;
*/
    printf("sizeof u8 %lu\n", sizeof(u8));
    printf("sizeof u16 %lu\n", sizeof(u16));
    printf("sizeof u32 %lu\n", sizeof(u32));
    printf("sizeof u64 %lu\n", sizeof(u64));

    printf("sizeof s8 %lu\n", sizeof(s8));
    printf("sizeof s16 %lu\n", sizeof(s16));
    printf("sizeof s32 %lu\n", sizeof(s32));
    printf("sizeof s64 %lu\n", sizeof(s64));

    printf("sizeof f32 %lu\n", sizeof(f32));
    printf("sizeof f64 %lu\n", sizeof(f64));

    if (argc < 3)
    {
        printf("XYCrypt by Bond697\n");
        printf("Based on research by Xfr and Bond697\n\n");
        printf("Usage:\n");
        printf("xypkmcrypt infile outfile\n");
	exit(0);
    }

    in_pkx = fopen(argv[1], "rb+");
    if (!in_pkx)
    {
        printf("Error opening in pkx file.");
        exit(3);
    }

    fseek(in_pkx, 0, SEEK_SET);
    fread(box_pkx, sizeof(u32), SIZE_BOX_PKX / sizeof(u32), in_pkx);

    fseek(in_pkx, 0, SEEK_END);     // get the size of the file
    u32 fsz = ftell(in_pkx); 
    fseek(in_pkx, 0, SEEK_SET);

    if ((fsz != SIZE_PARTY_PKX) && (fsz != SIZE_BOX_PKX))
    {
        printf("Pkx is the wrong size.");
        exit(5);
    }

    u32 decryptKey = box_pkx[0];    // key is now pid, not checksum

    CryptPkx(&box_pkx[2], &decryptKey, SIZE_PKX_CRYPT_LEN, &xypkx);
    UnshufflePkx(box_pkx, outbox_pkx);
    SetUncryptedDataEqual(box_pkx, outbox_pkx);

    if (!VerifyPkxChecksum(&box_pkx[2], (box_pkx[1] >> 16) & 0xFFFF, SIZE_PKX_CRYPT_LEN))
    {
        printf("Checksum failed.  Fixing.\n\n");
        FixPkxChecksum(box_pkx, SIZE_PKX_CRYPT_LEN);
    }

    if (fsz == SIZE_PARTY_PKX)
    {

        decryptKey = box_pkx[0];

        fseek(in_pkx, SIZE_BOX_PKX, SEEK_SET);
        fread(party_data, sizeof(u32), SIZE_PKX_PARTY_DATA / sizeof(u32), in_pkx);
    
        CryptPkx(party_data, &decryptKey, SIZE_PKX_PARTY_DATA, &xypkx);
    }

    out_pkx = fopen(argv[2], "wb+");
    if (!out_pkx)
    {
        printf("Error opening out pkx file.");
        exit(4);
    }

    fseek(out_pkx, 0, SEEK_SET);
    fwrite(outbox_pkx, sizeof(u32), SIZE_BOX_PKX / sizeof(u32), out_pkx);

    if (fsz == SIZE_PARTY_PKX)
    {
        fseek(out_pkx, SIZE_BOX_PKX, SEEK_SET);
        fwrite(party_data, sizeof(u32), SIZE_PKX_PARTY_DATA / sizeof(u32), out_pkx);
    }

    fclose(in_pkx);
    fclose(out_pkx);

    return 0;
}


void CryptPkx(u32* pkx, u32* key, u32 len, Rnd* cr)
{
    u16* epkx = (u16*)pkx;
    u16 cryptKey = 0;
    
    for (u32 i = 0; i < len / 2; ++i)
    {
        cryptKey = CryptRNG(key, cr);
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