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
	: comparison (OR comparison)*
	;
	
comparison
	: atomic (COMPARISON atomic)?
	;

atomic
	: STRING
	| WORD
	;
