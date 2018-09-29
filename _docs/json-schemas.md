# JSON schemas

## objects in `people.actives.items` and `people.alumni.items`

key | required | type | format | value(s)
--- | --- | --- | --- | ---
first_name | yes | string ||
middle_last_name | yes | string ||
photo | yes for objects in `people.actives.items` | string | absolute file path |
suffix | no | string ||
position | yes | string ||
bio | yes for objects in `people.actives.items` | string ||
cv | no | string | absolute file path or external URL for .pdf |
email | no | string | email address |
website | no | string | external URL |
twitter | no | string | external URL |
instagram | no | string | external URL |
flickr | no | string | external URL |
github | no | string | external URL |
category | yes | string || lab-director, staff, postdoctoral-researchers, student-researchers, visiting-researchers
staff_category | yes if `category: staff` | string || patient-coordinators, lab-managers
student_category | yes if `category: student-researchers` | string || graduate-students, medical-students, post-baccalaureate-students, undergraduate-students, hs-students, undergraduate-or-hs-students

## objects in `news.published.items` and `news.archive.items`

key | required | type | format | value(s)
--- | --- | --- | --- | ---
title | yes | string ||
source | yes | string ||
sub_source* | no | string ||
date | yes | string | YYYY-MM-DD |
url | yes | string ||
category | yes | string || print, audio, video
sites | yes | object || `news.items.sites`

\*deprecated

### `news.items.sites`

key | required | type | format | value(s)
--- | --- | --- | --- | ---
pcfn | yes | boolean ||
chatlab | yes | boolean ||

## objects in `research.items`

TODO: convert research.yml

## Liquid

### Empty strings and nulls

For optional keys, Liquid template logic should be constructed so the same behavior is seen for:

- Keys with `null` value
- Missing keys (when Netlify CMS processes user JSON / YAML, it reformats to remove any keys with `null` value)
- Empty strings (when user erases an optional field in Netlify CMS it's represented as an empty string, not `null`)

Liquid variables that are null or undefined are falsy, but empty string is truthy. In practice, the following construction should work:

```
{% if foo and foo != "" %}Do things{% endif %}
```

### Smart quotes

Use Jekyll's custom Liquid filters to deal with straight quotes and apostrophes entered via Netlify CMS interface:

```
{{ foo | smartify }}
```
## JSON

### Escaping

Need to escape double quotes with `\"`

## Schema tools (validation etc.)

- [Create schema from JSON online](https://app.quicktype.io/) ([also](https://www.jsonschema.net/))
- [Validate against schema online](https://www.jsonschemavalidator.net/) ([also](https://jsonschemalint.com/#/version/draft-06/markup/json))
