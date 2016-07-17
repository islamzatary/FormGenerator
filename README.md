FormGenerator.
=============

[Live Demo](http://islamzatary.com/projects/FormGenerator/form_generation.html).

Dependencies:

1. JQuery.


You want to generate form with very dynamic parameters?

You care about performance?

You want to manage the form data, style, labels, values, placeholder and others from one place?

Form Inputs types:

1. input
2. select
3. textarea
----------

	
How its work?
----------

we have a JSON file contain every thing you need, here is a sample of field:

{
	"id" : "missin_name",
	"element_type" : "input",
	"fname" : "mission_name",
	"ftype" :  "text",
	"class" : "",
	"js" : "",
	"value" : "",
	"style" : "",
	"default_value" : "",
	"placeholder_txt" : "Mission Name",
	"label" : "",
	"req" : "req"
}

so here is the parameters lists:

	1. Field/Element ID (id): the field id.
	2. Field/Element Type (element_type): to parse field/element type
	3. Field/Element Name (fname): field name.
	4. Field/Element Input Type (ftype): Input Type
	5. Widget Class (class): element type.
	5. Widget Javascript (js): element script.
	5. Widget Value (value): element value.
	5. Widget Style (style): element inline style.
	5. Widget Default value (default_value): Default value.
	5. Widget Placeholder (placeholder_txt): element placeholder text.
	5. Widget Label (label): label before the field element.
	5. Widget Required (req): parse field reuired.
	
Its Easy Peasy.

Please not that this project is part product of LegoStyle CSS framework, the framework still beta version but LegoForm can use it immediately with all of trust.

Share your opinion with us at iz@legostyle.com
