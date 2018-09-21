# Conventions

## Smart quotes and other Unicode

- For smart quotes just use Jekyll's custom Liquid filters, for example:

  ```
  {{ foo | smartify }}
  ```


## News

- Use title case (APA style exceptions)

## Publications

- See `research.md` and eventually move some of those docs here

## People

## Filenames

- For decomposable characters like `ñ` where `%C3%B1` is equivalent to `n%CC%83`, it's not clear whether it's better to use precomposed (NFC) or decomposed (NFD) version.

  As of macOS 10.13.6 the long-press shortcut to type characters with diacritics renders the precomposed version, but the macOS file system converts to decomposed version. Linux and Windows usually (?) use precomposed characters in filenames.

  By default, Git config on macOS is set to  core.precomposeunicode=true which means decomposed filenames are converted to precomposed.

  Issues can arise on the server when an html reference and the corresponding filename use different representations of the same character (broken link).

  Possibly:

  If on macOS, name the file using long-press / precomposed version; will automatically convert to decomposed version. Copy-paste decomposed version from filename into html. Upload file and html to server (both decomposed). Commit both to Git - filename converted to precomposed, html still decomposed but who cares? Maybe broken links if pull from git to Windows and try to upload to server?

  Or maybe use percent encoding for special characters? Most fool-proof, if kind of dumb-looking and time consuming
