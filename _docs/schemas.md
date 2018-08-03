## people_list

### person_active_elements

TODO: create `person_active_elements` JSON schema

key | required | type | format | value(s)
--- | --- | --- | --- | ---
first_name | yes | string ||
middle_last_name | yes | string ||
photo | yes | string | absolute file path |
suffix | no | string ||
position | yes | string ||
bio | yes | string ||
cv | no | string | absolute file path or external URL for .pdf |
email | no | string | email address |
website | no | string | external URL |
twitter | no | string | external URL |
instagram | no | string | external URL |
flickr | no | string | external URL |
github | no | string | external URL |
category | yes | string || lab_director, staff, postdoctoral_researchers, student_researchers, visiting_researchers
staff_category | yes if `category: staff` | string || patient_coordinators, lab_managers
student_category | yes if `category: student_researchers` | string || graduate_students, medical_students, post_baccalaureate_students, undergraduate_students, hs_students, undergraduate_or_hs_students
status | yes | string || active

### person_alum_elements

TODO: create `person_alum_elements` JSON schema

key | required | type | format | value(s)
--- | --- | --- | --- | ---
first_name | yes | string ||
middle_last_name | yes | string ||
photo | no | string | absolute file path |
suffix | no | string ||
position | no | string ||
bio | no | string ||
cv | no | string | absolute file path or external URL for .pdf |
email | no | string | email address |
website | no | string | external URL |
twitter | no | string | external URL |
instagram | no | string | external URL |
flickr | no | string | external URL |
github | no | string | external URL |
category | yes | string || lab_director, staff, postdoctoral_researchers, student_researchers, visiting_researchers
staff_category | yes if `category: staff` | string || patient_coordinators, lab_managers
student_category | yes if `category: student_researchers` | string || graduate_students, medical_students, post_baccalaureate_students, undergraduate_students, hs_students, undergraduate_or_hs_students
status | yes | string || alum

## news_list

### news_elements

see [`news_elements`](../_data/schemas/news.json) JSON schema

key | required | type | format | value(s)
--- | --- | --- | --- | ---
title | yes | string ||
source | yes | string ||
sub_source | no | string ||
date | yes | string | YYYY-MM-DD |
media_url | no | string ||
media_type | yes | string || print, audio, video

## Liquid

### Empty strings and nulls

For optional keys, Liquid template logic should be constructed so the same behavior is seen for:

- Key set with null value
- Missing keys (when Netlify CMS processes user JSON / YAML, it reformats to remove any keys set with null value)
- Empty strings (when user erases an optional field in Netlify CMS it's represented as an empty string, not null)

Liquid variables that are null or undefined are falsy, but empty string is truthy. In practice, the following construction should work:

```
{% if foo and foo != "" %}Do things{% endif %}
```

### Smart quotes

Use Jeckyll's custom Liquid filters to deal with straight quotes and apostrophes entered via Netlify CMS interface:

```
{{ foo | smartify }}
```

## Schema tools (validation etc.)

- [Create schema from JSON online](https://app.quicktype.io/) ([also](https://www.jsonschema.net/))
- [Validate against schema online](https://www.jsonschemavalidator.net/) ([also](https://jsonschemalint.com/#/version/draft-06/markup/json))
