# JSON validation

for objects in `people.json`, `news.json`, and `publications.json`

## general notes

- for all strings containing double quotes, JSON requires escaping via `\"`

## objects in `people` array

key | required | type | format | value(s)
--- | --- | --- | --- | ---
first_name | yes | string ||
middle_last_name | yes | string ||
suffix | no | string ||
position | yes | string ||
alum | yes | boolean ||
photo | yes unless `alum` is `true` | string | absolute file path |
bio | yes unless `alum` is `true` | string ||
category | yes | string || lab_director, staff, postdoctoral_researchers, student_researchers, visiting_researchers
staff_category | yes if `category` is `staff` | string || patient_coordinators, lab_managers
student_category | yes if `category` is `student_researchers` | string || graduate_students, medical_students, post_baccalaureate_students, undergraduate_students, hs_students, undergraduate_or_hs_students
cv | no | string | absolute file path or external URL |
email | no | string | email address |
website | no | string | external URL |
twitter | no | string | external URL |
instagram | no | string | external URL |
flickr | no | string | external URL |
github | no | string | external URL |

### notes and conventions for objects in `people` array

#### `category`

- use singular; also maybe merge `staff_category` and `student_category` into `category`

## objects in `news` array

key | required | type | format | value(s)
--- | --- | --- | --- | ---
title | yes | string ||
source | yes | string ||
sub_source* | no | string ||
date | yes | string | YYYY-MM-DD |
url | yes unless `archived` is `true` | string ||
category | yes | string || print, audio, video
archived | yes | boolean ||
site_pcfn | yes | boolean ||
site_chatlab | yes | boolean ||

### notes and conventions for objects in `news` array

#### `title`

- use title case

#### `sub_source`

- deprecated in templates

## objects in `publications` array

key | required | type | format | value(s)
--- | --- | --- | --- | ---
work_authors | yes | string ||
work_year | yes | integer ||
work_title | yes | string ||
work_publication_format | yes | string || article_in_journal, article_in_edited_work
work_doi | no | string ||
work_post_date | yes | string | YYYY-MM-DD |
pdf | no | string | absolute file path |
category | yes | string || language_and_space, event_representation, neuroaesthetics, neuroethics, miscellaneous
review | yes | boolean ||
link | yes | boolen ||

### if `work_publication_format` is `article_in_journal`

key | required | type | format | value(s)
--- | --- | --- | --- | ---
journal_title | yes | string ||
journal_advance | yes | boolean ||
journal_vol | yes unless `journal_advance` is `true` | integer ||
journal_issue | no | integer ||
journal_pages_start | yes unless `journal_advance` is `true` | integer ||
journal_pages_stop | yes unless `journal_advance` is `true` | integer ||

### if `work_publication_format` is `article_in_edited_work`

key | required | type | format | value(s)
--- | --- | --- | --- | ---
edited_work_type | yes | string || book, conference
edited_work_title | yes | string ||
edited_work_pages_start | yes | integer ||
edited_work_pages_stop | yes | integer ||
edited_work_editors | yes | string ||
edited_work_location | yes | string ||
edited_work_publisher | yes | string ||

### if `review` is `true`

key | required | type | format | value(s)
--- | --- | --- | --- | ---
review_type | yes | string || review, conmmentary
reviewed_work_type | yes | string ||
reviewed_work_title | yes | string ||
reviewed_work_author | yes | string ||

### if `link` is `true`

key | required | type | format | value(s)
--- | --- | --- | --- | ---
link_name | yes | string ||
link_url | yes | absolute file path or external URL ||

### notes and conventions for objects in `publications` array

#### `work_authors`

- for each author: last name + comma + first initial + middle initial(s)
- period after each initial, space between consecutive initials
- if multiple authors, comma after each (even if only two authors), including oxford comma
- use ampersand & before final author, not "and"
- hyphenated names become hyphenated initials, no space (e.g., if middle name is `Jean-Baptise` use `J.-B.`)

#### `work_year`

- four-digit year

#### `work_title`

- capitalize first word, proper nouns, and the first word after a colon
- do not end with period (inserted by template)
- if title ends with question mark, include this (template will skip inserting default period in this case)

#### `work_doi`

- TODO: formating notes
- DOI is not currently implemented in template for articles in edited works

#### `work_post_date`

- not fully implemented yet. using increasing integers for newer publications, starting at 1 within each category. use work_post_date to sort chronologically (JSON is unordered). need to keep separate work_year to include in the citation itself (occasionally, might be different than post date?).

#### `pdf`

- if null, template won't display title as link

#### `review`

- template not currently implemented for reviews in edited works

#### `journal_title`

#### `journal_vol`

#### `journal_issue`

#### `journal_pages_start`

#### `journal_pages_stop`

#### `edited_work_type`

- currently, of no consequence to how publication is displayed in template

#### `edited_work_title`

#### `edited_work_pages_start`

#### `edited_work_pages_stop`

#### `edited_work_editors`

#### `edited_work_location`

#### `edited_work_publisher`

#### `review_type`

- determines whether template displays publication as "Review of" or "Commentary on"

#### `reviewed_work_type`

- template displays this as "Review of/Commentary on the <reviewed_work_type>"

#### `reviewed_work_title`

#### `reviewed_work_author`

#### `link_name`

#### `link_url`

## TODO
* find work_post_date for all pubs
* fill in notes for publications
* constants in enums uppercase with underscore e.g., LAB_DIRECTOR
* camelCase property names?
* be more semantic with property names e.g., photo_path instead of photo, twitter_url instead of twitter

## JSON Schema tools (spec, generate, validate, etc.)

- [JSON Schema](https://json-schema.org/)
- [Create schema from JSON online](https://app.quicktype.io/) ([also](https://www.jsonschema.net/))
- [Validate against schema online](https://www.jsonschemavalidator.net/) ([also](https://jsonschemalint.com/#/version/draft-06/markup/json))
