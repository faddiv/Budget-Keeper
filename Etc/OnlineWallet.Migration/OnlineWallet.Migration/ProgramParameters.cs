using System.Collections.Generic;
using System.Reflection;
using CommandLine;
using CommandLine.Text;

namespace OnlineWallet.Migration
{
    public class ProgramParameters
    {
        [Option('i', DefaultValue = "Incomes")]
        public string IncomeOutput { get; set; }

        [Option('e', DefaultValue = "Expenses")]
        public string ExpenseOutput { get; set; }

        [ValueList(typeof(List<string>))]
        public IList<string> InputFiles { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            var help = new HelpText
            {
                Heading = new HeadingInfo("Online wallet migrator", Assembly.GetEntryAssembly().GetName().Version.ToString()),
                Copyright = new CopyrightInfo("Viktor Faddi", 2017),
                AdditionalNewLineAfterOption = true,
                AddDashesToOption = true
            };
            help.AddPreOptionsLine("Online wallet migrator");
            help.AddOptions(this);
            return help;
        }
    }
}