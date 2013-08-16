using System;

namespace ApiClient
{
    public class TeamStatistics
    {
        public int TotalPlays { get; set; }

        public int TotalYards { get; set; }

        public double YardsPerPlay { get; set; }

        public int Penalties { get; set; }

        public int PenaltyYards { get; set; }

        public int PassingAttempts { get; set; }

        public int PassingCompletions { get; set; }

        public int PassingYards { get; set; }

        public int PassingTouchdowns { get; set; }

        public double PassingAverage { get; set; }

        public int RushingAttempts { get; set; }

        public int RushingYards { get; set; }

        public double RushingAverage { get; set; }

        public int ReceivingCompletions { get; set; }

        public int ReceivingYards { get; set; }

        public double ReceivingAverage { get; set; }

        public int Turnovers { get; set; }

        public int Fumbles { get; set; }

        public int FumblesLost { get; set; }

        public int Interceptions { get; set; }

        public TimeSpan TimeOfPossession { get; set; }

        public double DefensiveSacks { get; set; }

        public int DefensiveSackYardage { get; set; }

        public int KickingFieldGoalLong { get; set; }

        public int KickingExtraPointAttempted { get; set; }

        public int KickingExtraPointMakes { get; set; }

        public int Kickoffs { get; set; }

        public int KickoffTotalYards { get; set; }

        public int KickoffLong { get; set; }

        public int PuntingAttempts { get; set; }
        public double PuntingAverageYards { get; set; }

        public int PassesDefended { get; set; }

        public int FirstDownAttempts { get; set; }
        public int SecondDownAttempts { get; set; }
        public int ThirdDownAttempts { get; set; }
        public int FourthDownAttempts { get; set; }
        public int FirstDownConversions { get; set; }
        public int SecondDownConversions { get; set; }
        public int ThirdDownConversions { get; set; }
        public double ThirdDownConversionPercentage { get; set; }
        public int FourthDownConversions { get; set; }
        public double FourthDownConversionPercentage { get; set; }
        public int FirstDownsRushing { get; set; }
        public int FirstDownsPassing { get; set; }
        public int FirstDownsPenalty { get; set; }
        public int FirstDowns { get; set; }
        public int RecoveryFumbles { get; set; }
    }
}