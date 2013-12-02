{
  "targets": [
    {
      "target_name": "xycrypt",
      "sources": [ "src/xycrypt_wrap.cc", "src/xycrypt.cc" ],
      "cflags_cc": ["-Wno-missing-braces"],
      "xcode_settings": { "OTHER_CFLAGS": ["-Wno-missing-braces"] }
    }
  ]
}
