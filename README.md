# msgpack-fs

Roll up a file or directory with MessagePack

## Options

- `-n` : Trim whitespace on values.
- `-p, --parents=DEPTH` : Include specified path up to directory as keys in
  message. The `-p` flag will include all specified path components, wheras
  the `--parents=DEPTH` option specifies the number of levels to keep.
- `-k` : Effectively short for `--parents=1`: outputs messages as objects with
  the filename as the key and the directory / file contents as the value.
- `-o=FILE` : Specify output file `FILE`. Existing file contents will be
  clobbered.
- `-b` : Reserved for future use (if/when this library is updated to use the
  msgpack v5 spec, will use the "bin" type for file contents).
