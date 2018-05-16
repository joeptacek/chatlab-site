For optional keys, Liquid template logic should be constructed so the same behavior is seen for:

- Key set with null value
- Missing keys (when Netlify CMS processes user JSON / YAML, it reformats to remove any keys set with null value)
- Empty strings (when user erases an optional field in Netlify CMS it's represented as an empty string, not null)

Liquid variables that are null or undefined are falsy, but empty string is truthy. In practice, the following construction should work:

```
{% if foo and foo != "" %}Do things{% endif %}
```

## news_list

key | required | type | format | values
--- | --- | --- | --- | ---
title | yes | string ||
source | yes | string ||
sub_source | no | string ||
date | yes | string | YYYY-MM-DD |
media_url | no | string ||
media_type | yes | string || print, audio, video
