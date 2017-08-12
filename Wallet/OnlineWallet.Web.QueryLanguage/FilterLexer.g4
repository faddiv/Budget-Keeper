lexer grammar FilterLexer;

@lexer::members
{
    protected const int EOF = Eof;
    protected const int HIDDEN = Hidden;
}

AND
	: A N D
	;
	
OR
	: O R
	;

WORD
	: [a-zA-Z0-9]+
	;

fragment A:('a'|'A');
fragment B:('b'|'B');
fragment C:('c'|'C');
fragment D:('d'|'D');
fragment E:('e'|'E');
fragment F:('f'|'F');
fragment G:('g'|'G');
fragment H:('h'|'H');
fragment I:('i'|'I');
fragment J:('j'|'J');
fragment K:('k'|'K');
fragment L:('l'|'L');
fragment M:('m'|'M');
fragment N:('n'|'N');
fragment O:('o'|'O');
fragment P:('p'|'P');
fragment Q:('q'|'Q');
fragment R:('r'|'R');
fragment S:('s'|'S');
fragment T:('t'|'T');
fragment U:('u'|'U');
fragment V:('v'|'V');
fragment W:('w'|'W');
fragment X:('x'|'X');
fragment Y:('y'|'Y');
fragment Z:('z'|'Z');

/*fragment ESCAPED_CHARACTER 
	: '\\\''
	| '\\"'
	| '\\n'
	| '\\f'
	| '\\r'
	| '\\t'
	| '\\v'
	;

fragment UNICODE_CHARACTER
	: '\\u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
	;

fragment SPECIAL_CHARACTER
	: ESCAPED_CHARACTER
	| UNICODE_CHARACTER
	;
	
fragment STRING
	: '"' (~["\\] | SPECIAL_CHARACTER)* '"'
	;

fragment SINGLE_QUOTE_STRING
	: '\'' (~['\\] | SPECIAL_CHARACTER)* '\''
	;
	
fragment IDENTIFIER_BEGIN
	: [a-z]
	| [A-Z]
	| '_'
	| '$';
IDENTIFIER 
	: IDENTIFIER_BEGIN (IDENTIFIER_BEGIN | [0-9])*
	;

ARRAY_OPENING
	: '['
	;
	
ARRAY_CLOSING
	: ']'
	;

COLON
	: ':'
	;

COMMA
	: ','
	;
	
OBJECT_OPENING
	: '{'
	;

OBJECT_CLOSING
	: '}'
	;

DOT
	: '.'
	;
	
PARENTHESES_OPEN
	: '('
	;

PARENTHESES_CLOSE
	: ')'
	;
	*/
WHITESPACE
	: (' ' | '\n' | '\r' | '\t' | '\u000B' | '\u00A0' ) -> channel(HIDDEN);