parser grammar FilterParser;

options { tokenVocab=FilterLexer; }

filter 
	: primary EOF
	;

primary
	: andTerm+
	;
	
andTerm
	: orTerm (AND orTerm)*
	;

orTerm
	: searchTerm (OR searchTerm)*
	;
	

searchTerm
	: WORD
	;
