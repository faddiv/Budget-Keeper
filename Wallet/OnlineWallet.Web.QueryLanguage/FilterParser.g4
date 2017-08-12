parser grammar FilterParser;

options { tokenVocab=FilterLexer; }

filter 
	: primary EOF
	;

primary
	: orTerm+
	;

orTerm
	: andTerm (OR andTerm)*
	;
	
andTerm
	: searchTerm (AND searchTerm)*
	;

searchTerm
	: WORD
	;
