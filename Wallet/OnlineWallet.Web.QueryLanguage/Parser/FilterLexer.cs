//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     ANTLR Version: 4.6.4
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Generated from FilterLexer.g4 by ANTLR 4.6.4

// Unreachable code detected
#pragma warning disable 0162
// The variable '...' is assigned but its value is never used
#pragma warning disable 0219
// Missing XML comment for publicly visible type or member '...'
#pragma warning disable 1591
// Ambiguous reference in cref attribute
#pragma warning disable 419

namespace OnlineWallet.Web.QueryLanguage.Parser {
using Antlr4.Runtime;
using Antlr4.Runtime.Atn;
using Antlr4.Runtime.Misc;
using DFA = Antlr4.Runtime.Dfa.DFA;

[System.CodeDom.Compiler.GeneratedCode("ANTLR", "4.6.4")]
[System.CLSCompliant(false)]
public partial class FilterLexer : Lexer {
	public const int
		AND=1, OR=2, WORD=3, WHITESPACE=4;
	public static string[] modeNames = {
		"DEFAULT_MODE"
	};

	public static readonly string[] ruleNames = {
		"AND", "OR", "WORD", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
		"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", 
		"Y", "Z", "WHITESPACE"
	};


	    protected const int EOF = Eof;
	    protected const int HIDDEN = Hidden;


	public FilterLexer(ICharStream input)
		: base(input)
	{
		_interp = new LexerATNSimulator(this,_ATN);
	}

	private static readonly string[] _LiteralNames = {
	};
	private static readonly string[] _SymbolicNames = {
		null, "AND", "OR", "WORD", "WHITESPACE"
	};
	public static readonly IVocabulary DefaultVocabulary = new Vocabulary(_LiteralNames, _SymbolicNames);

	[System.Obsolete("Use Vocabulary instead.")]
	public static readonly string[] tokenNames = GenerateTokenNames(DefaultVocabulary, _SymbolicNames.Length);

	private static string[] GenerateTokenNames(IVocabulary vocabulary, int length) {
		string[] tokenNames = new string[length];
		for (int i = 0; i < tokenNames.Length; i++) {
			tokenNames[i] = vocabulary.GetLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = vocabulary.GetSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}

		return tokenNames;
	}

	[System.Obsolete("Use IRecognizer.Vocabulary instead.")]
	public override string[] TokenNames
	{
		get
		{
			return tokenNames;
		}
	}

	[NotNull]
	public override IVocabulary Vocabulary
	{
		get
		{
			return DefaultVocabulary;
		}
	}

	public override string GrammarFileName { get { return "FilterLexer.g4"; } }

	public override string[] RuleNames { get { return ruleNames; } }

	public override string[] ModeNames { get { return modeNames; } }

	public override string SerializedAtn { get { return _serializedATN; } }

	public static readonly string _serializedATN =
		"\x3\xAF6F\x8320\x479D\xB75C\x4880\x1605\x191C\xAB37\x2\x6\x83\b\x1\x4"+
		"\x2\t\x2\x4\x3\t\x3\x4\x4\t\x4\x4\x5\t\x5\x4\x6\t\x6\x4\a\t\a\x4\b\t\b"+
		"\x4\t\t\t\x4\n\t\n\x4\v\t\v\x4\f\t\f\x4\r\t\r\x4\xE\t\xE\x4\xF\t\xF\x4"+
		"\x10\t\x10\x4\x11\t\x11\x4\x12\t\x12\x4\x13\t\x13\x4\x14\t\x14\x4\x15"+
		"\t\x15\x4\x16\t\x16\x4\x17\t\x17\x4\x18\t\x18\x4\x19\t\x19\x4\x1A\t\x1A"+
		"\x4\x1B\t\x1B\x4\x1C\t\x1C\x4\x1D\t\x1D\x4\x1E\t\x1E\x4\x1F\t\x1F\x3\x2"+
		"\x3\x2\x3\x2\x3\x2\x3\x3\x3\x3\x3\x3\x3\x4\x6\x4H\n\x4\r\x4\xE\x4I\x3"+
		"\x5\x3\x5\x3\x6\x3\x6\x3\a\x3\a\x3\b\x3\b\x3\t\x3\t\x3\n\x3\n\x3\v\x3"+
		"\v\x3\f\x3\f\x3\r\x3\r\x3\xE\x3\xE\x3\xF\x3\xF\x3\x10\x3\x10\x3\x11\x3"+
		"\x11\x3\x12\x3\x12\x3\x13\x3\x13\x3\x14\x3\x14\x3\x15\x3\x15\x3\x16\x3"+
		"\x16\x3\x17\x3\x17\x3\x18\x3\x18\x3\x19\x3\x19\x3\x1A\x3\x1A\x3\x1B\x3"+
		"\x1B\x3\x1C\x3\x1C\x3\x1D\x3\x1D\x3\x1E\x3\x1E\x3\x1F\x3\x1F\x3\x1F\x3"+
		"\x1F\x2\x2\x2 \x3\x2\x3\x5\x2\x4\a\x2\x5\t\x2\x2\v\x2\x2\r\x2\x2\xF\x2"+
		"\x2\x11\x2\x2\x13\x2\x2\x15\x2\x2\x17\x2\x2\x19\x2\x2\x1B\x2\x2\x1D\x2"+
		"\x2\x1F\x2\x2!\x2\x2#\x2\x2%\x2\x2\'\x2\x2)\x2\x2+\x2\x2-\x2\x2/\x2\x2"+
		"\x31\x2\x2\x33\x2\x2\x35\x2\x2\x37\x2\x2\x39\x2\x2;\x2\x2=\x2\x6\x3\x2"+
		"\x1E\x5\x2\x32;\x43\\\x63|\x4\x2\x43\x43\x63\x63\x4\x2\x44\x44\x64\x64"+
		"\x4\x2\x45\x45\x65\x65\x4\x2\x46\x46\x66\x66\x4\x2GGgg\x4\x2HHhh\x4\x2"+
		"IIii\x4\x2JJjj\x4\x2KKkk\x4\x2LLll\x4\x2MMmm\x4\x2NNnn\x4\x2OOoo\x4\x2"+
		"PPpp\x4\x2QQqq\x4\x2RRrr\x4\x2SSss\x4\x2TTtt\x4\x2UUuu\x4\x2VVvv\x4\x2"+
		"WWww\x4\x2XXxx\x4\x2YYyy\x4\x2ZZzz\x4\x2[[{{\x4\x2\\\\||\x6\x2\v\r\xF"+
		"\xF\"\"\xA2\xA2i\x2\x3\x3\x2\x2\x2\x2\x5\x3\x2\x2\x2\x2\a\x3\x2\x2\x2"+
		"\x2=\x3\x2\x2\x2\x3?\x3\x2\x2\x2\x5\x43\x3\x2\x2\x2\aG\x3\x2\x2\x2\tK"+
		"\x3\x2\x2\x2\vM\x3\x2\x2\x2\rO\x3\x2\x2\x2\xFQ\x3\x2\x2\x2\x11S\x3\x2"+
		"\x2\x2\x13U\x3\x2\x2\x2\x15W\x3\x2\x2\x2\x17Y\x3\x2\x2\x2\x19[\x3\x2\x2"+
		"\x2\x1B]\x3\x2\x2\x2\x1D_\x3\x2\x2\x2\x1F\x61\x3\x2\x2\x2!\x63\x3\x2\x2"+
		"\x2#\x65\x3\x2\x2\x2%g\x3\x2\x2\x2\'i\x3\x2\x2\x2)k\x3\x2\x2\x2+m\x3\x2"+
		"\x2\x2-o\x3\x2\x2\x2/q\x3\x2\x2\x2\x31s\x3\x2\x2\x2\x33u\x3\x2\x2\x2\x35"+
		"w\x3\x2\x2\x2\x37y\x3\x2\x2\x2\x39{\x3\x2\x2\x2;}\x3\x2\x2\x2=\x7F\x3"+
		"\x2\x2\x2?@\x5\t\x5\x2@\x41\x5#\x12\x2\x41\x42\x5\xF\b\x2\x42\x4\x3\x2"+
		"\x2\x2\x43\x44\x5%\x13\x2\x44\x45\x5+\x16\x2\x45\x6\x3\x2\x2\x2\x46H\t"+
		"\x2\x2\x2G\x46\x3\x2\x2\x2HI\x3\x2\x2\x2IG\x3\x2\x2\x2IJ\x3\x2\x2\x2J"+
		"\b\x3\x2\x2\x2KL\t\x3\x2\x2L\n\x3\x2\x2\x2MN\t\x4\x2\x2N\f\x3\x2\x2\x2"+
		"OP\t\x5\x2\x2P\xE\x3\x2\x2\x2QR\t\x6\x2\x2R\x10\x3\x2\x2\x2ST\t\a\x2\x2"+
		"T\x12\x3\x2\x2\x2UV\t\b\x2\x2V\x14\x3\x2\x2\x2WX\t\t\x2\x2X\x16\x3\x2"+
		"\x2\x2YZ\t\n\x2\x2Z\x18\x3\x2\x2\x2[\\\t\v\x2\x2\\\x1A\x3\x2\x2\x2]^\t"+
		"\f\x2\x2^\x1C\x3\x2\x2\x2_`\t\r\x2\x2`\x1E\x3\x2\x2\x2\x61\x62\t\xE\x2"+
		"\x2\x62 \x3\x2\x2\x2\x63\x64\t\xF\x2\x2\x64\"\x3\x2\x2\x2\x65\x66\t\x10"+
		"\x2\x2\x66$\x3\x2\x2\x2gh\t\x11\x2\x2h&\x3\x2\x2\x2ij\t\x12\x2\x2j(\x3"+
		"\x2\x2\x2kl\t\x13\x2\x2l*\x3\x2\x2\x2mn\t\x14\x2\x2n,\x3\x2\x2\x2op\t"+
		"\x15\x2\x2p.\x3\x2\x2\x2qr\t\x16\x2\x2r\x30\x3\x2\x2\x2st\t\x17\x2\x2"+
		"t\x32\x3\x2\x2\x2uv\t\x18\x2\x2v\x34\x3\x2\x2\x2wx\t\x19\x2\x2x\x36\x3"+
		"\x2\x2\x2yz\t\x1A\x2\x2z\x38\x3\x2\x2\x2{|\t\x1B\x2\x2|:\x3\x2\x2\x2}"+
		"~\t\x1C\x2\x2~<\x3\x2\x2\x2\x7F\x80\t\x1D\x2\x2\x80\x81\x3\x2\x2\x2\x81"+
		"\x82\b\x1F\x2\x2\x82>\x3\x2\x2\x2\x4\x2I\x3\x2\x3\x2";
	public static readonly ATN _ATN =
		new ATNDeserializer().Deserialize(_serializedATN.ToCharArray());
}
} // namespace OnlineWallet.Web.QueryLanguage.Parser