namespace ApiClient
{
    public class PlayerStats
    {      
        public int CombineId { get; set; }

        /// <summary>
        ///     Gets or sets the name of the player.
        /// </summary>
        /// <value>
        ///     The name of the player.
        /// </value>
        // TODO: I don't think this is ever set to anything other than itself; essentially making it always be null. If so, remove this, or fix the setters. -jadams 4/25/2013
        public string PlayerName { get; set; }

        /// <summary>
        ///     Gets or sets the number of games played.
        /// </summary>
        /// <value>
        ///     The number of games played.
        /// </value>
        public long GamesPlayed { get; set; }

        /// <summary>
        ///     Gets or sets the yards per game.
        /// </summary>
        /// <value>
        ///     The yards per game.
        /// </value>
        public double YardsPerGame { get; set; }

        /// <summary>
        ///     Gets or sets the plays.
        /// </summary>
        /// <value>
        ///     The plays.
        /// </value>
        public int Plays { get; set; }

        // attempts at each passing/receiving/rushing
        public int Yards { get; set; }

        /// <summary>
        ///     Gets or sets the touchdowns.
        /// </summary>
        /// <value>
        ///     The touchdowns.
        /// </value>
        public int Touchdowns { get; set; }

        /// <summary>
        ///     Gets or sets the field goals.
        /// </summary>
        /// <value>
        ///     The field goals.
        /// </value>
        public int FieldGoals { get; set; }

        public int Points { get; set; }

        // ReSharper disable InconsistentNaming
        public double QBR { get; set; }

        //// ReSharper restore InconsistentNaming

        public long TeamId { get; set; }

        public int RushingAttempts { get; set; }

        public int RushingYards { get; set; }

        public int RushingLong { get; set; }

        public int RushingTouchdowns { get; set; }

        public int RushingFumbles { get; set; }

        public double RushingAverage { get; set; }

        public int PassingAttempts { get; set; }

        public int PassingCompletions { get; set; }

        public int PassingYards { get; set; }

        public int PassingTouchdowns { get; set; }

        public int PassingInterceptions { get; set; }

        public int PassingSacked { get; set; }

        public int PassingLong { get; set; }

        /// <summary>
        ///     Gets or sets the passing completion percentage. Range: 0.0-100.0 (full percentages)
        /// </summary>
        /// <remarks>
        ///     = Passing completions / passing attempts.
        /// </remarks>
        public double PassingCompletionPercentage { get; set; }

        public int ReceivingAttempts { get; set; }

        public int ReceivingCatches { get; set; }

        public int ReceivingLong { get; set; }

        public int ReceivingTouchdowns { get; set; }

        public int ReceivingFumbles { get; set; }

        public double ReceivingAverage { get; set; }

        public int ReceivingYards { get; set; }

        /// <summary>
        ///     Gets or sets the defensive tackles (including normal, for loss, sacks, etc.); includes halves (0.5) for assisted tackles
        /// </summary>
        public double DefensiveTackles { get; set; }

        /// <summary>
        ///     Gets or sets the unassisted tackles
        /// </summary>
        public int DefensiveSoloTackles { get; set; }

        /// <summary>
        ///     Gets or sets the assisted tackles
        /// </summary>
        /// <remarks>This is always an integer, the count of assists. (In other words, no half-points for assisted tackles.)</remarks>
        public int DefensiveAssistTackles { get; set; }

        /// <summary>
        ///     Gets or sets the defensive sacks; includes halves (0.5) for assisted sacks
        /// </summary>
        public double DefensiveSacks { get; set; }

        public int DefensiveSackYards { get; set; }

        /// <summary>
        ///     Gets or sets the defensive tackles for loss; includes halves (0.5) for assisted tackles
        /// </summary>
        public double DefensiveTacklesForLoss { get; set; }

        public int DefensiveInterceptions { get; set; }

        public int DefensiveTouchdowns { get; set; }

        public int PassesDefended { get; set; }

        public int KickingFieldGoalAttempts { get; set; }

        public int KickingFieldGoalMakes { get; set; }

        public int KickingFieldGoalLong { get; set; }

        public int KickingFieldGoalBlocked { get; set; }

        /// <summary>
        ///     Gets or sets the kicking field goal percentage. Range: 0.0-100.0 (full percentages)
        /// </summary>
        /// <remarks>
        ///     = Kicking field goal makes / attempts.
        /// </remarks>
        public double KickingFieldGoalMakePercentage { get; set; }

        public int KickingExtraPointAttempted { get; set; }

        public int KickingExtraPointMakes { get; set; }

        public int KickingExtraPointBlocked { get; set; }

        public int PuntingAttempts { get; set; }

        public int PuntingTotalYards { get; set; }

        public double PuntingAverageYards { get; set; }

        public int PuntingLong { get; set; }

        public int PuntsInside20 { get; set; }

        public int PuntsInside10 { get; set; }

        public int PuntsBlocked { get; set; }

        public int PuntReturnAttempts { get; set; }

        public int PuntReturnYards { get; set; }

        public double PuntReturnAverageYards { get; set; }

        public int PuntReturnLong { get; set; }

        public int PuntReturnTouchdowns { get; set; }

        public int PuntReturnFumbles { get; set; }

        public int KickoffReturnAttempts { get; set; }

        public int KickoffReturnYards { get; set; }

        public double KickoffReturnAverageYards { get; set; }

        public int KickoffReturnLong { get; set; }

        public int KickoffReturnTouchdowns { get; set; }

        public int KickoffReturnFumbles { get; set; }

        public int Kickoffs { get; set; }

        public int KickoffTotalYards { get; set; }

        public int KickoffLong { get; set; }

        public int Fumbles { get; set; }

        public int FumbleRecoveryTouchdowns { get; set; }

        public int FumbleRecoveries { get; set; }

        public int FumblesCaused { get; set; }

        public int InterceptionTouchdowns { get; set; }

        public int FieldGoalsAttempted0to19 { get; set; }

        public int FieldGoalsAttempted20to29 { get; set; }

        public int FieldGoalsAttempted30to39 { get; set; }

        public int FieldGoalsAttempted40to49 { get; set; }

        public int FieldGoalsAttempted50toHigher { get; set; }

        public int FieldGoalsMade0to19 { get; set; }

        public int FieldGoalsMade20to29 { get; set; }

        public int FieldGoalsMade30to39 { get; set; }

        public int FieldGoalsMade40to49 { get; set; }

        public int FieldGoalsMade50toHigher { get; set; }

        public int Penalties { get; set; }

        public int PenaltyYards { get; set; }

        /// <summary>
        ///     Gets or sets the game id.
        /// </summary>
        /// <value>
        ///     The game id.
        /// </value>
        public long GameId { get; set; }

        /// <summary>
        ///     Gets or sets the player id.
        /// </summary>
        /// <value>
        ///     The player id.
        /// </value>
        public long PlayerId { get; set; }

        /// <summary>
        ///     Gets or sets the team season id.
        /// </summary>
        /// <value>
        ///     The team season id.
        /// </value>
        public long TeamSeasonId { get; set; }

        /// <summary>
        /// Whether or not the output of this statistic should be aggregated or added to existing stats
        /// For example, the PassingLong statistic should be the max aggregated across all individual events, but the quick entry value should be added
        /// to the max aggregate
        /// </summary>
        public bool IsAdditive { get; set; }

        /// <summary>
        /// Gets or sets the first down attempts.
        /// </summary>
        /// <value>
        /// The first down attempts.
        /// </value>
        public int FirstDownAttempts { get; set; }

        /// <summary>
        /// Gets or sets the second down attempts.
        /// </summary>
        /// <value>
        /// The second down attempts.
        /// </value>
        public int SecondDownAttempts { get; set; }

        /// <summary>
        /// Gets or sets the third down attempts.
        /// </summary>
        /// <value>
        /// The third down attempts.
        /// </value>
        public int ThirdDownAttempts { get; set; }

        /// <summary>
        /// Gets or sets the fourth down attempts.
        /// </summary>
        /// <value>
        /// The fourth down attempts.
        /// </value>
        public int FourthDownAttempts { get; set; }

        /// <summary>
        /// Gets or sets the first down conversions.
        /// </summary>
        /// <value>
        /// The first down conversions.
        /// </value>
        public int FirstDownConversions { get; set; }

        /// <summary>
        /// Gets or sets the second down conversions.
        /// </summary>
        /// <value>
        /// The second down conversions.
        /// </value>
        public int SecondDownConversions { get; set; }

        /// <summary>
        /// Gets or sets the third down conversions.
        /// </summary>
        /// <value>
        /// The third down conversions.
        /// </value>
        public int ThirdDownConversions { get; set; }

        /// <summary>
        /// Gets or sets the fourth down conversions.
        /// </summary>
        /// <value>
        /// The fourth down conversions.
        /// </value>
        public int FourthDownConversions { get; set; }

        /// <summary>
        /// Gets or sets the first downs rushing.
        /// </summary>
        /// <value>
        /// The first downs rushing.
        /// </value>
        public int FirstDownsRushing { get; set; }

        /// <summary>
        /// Gets or sets the first downs passing.
        /// </summary>
        /// <value>
        /// The first downs passing.
        /// </value>
        public int FirstDownsPassing { get; set; }

        /// <summary>
        /// Gets or sets the first downs penalty.
        /// </summary>
        /// <value>
        /// The first downs penalty.
        /// </value>
        public int FirstDownsPenalty { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [fumble was lost].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [fumble was lost]; otherwise, <c>false</c>.
        /// </value>
        public int FumblesLost { get; set; }

        /// <summary>
        /// Gets or sets the touchbacks.
        /// </summary>
        /// <value>
        /// The touchbacks.
        /// </value>
        public int Touchbacks { get; set; }

        /// <summary>
        /// Gets or sets the safeties caused.
        /// </summary>
        /// <value>
        /// The safeties caused.
        /// </value>
        public int SafetiesCaused { get; set; }

        /// <summary>
        /// Gets or sets the recovery fumbles.
        /// </summary>
        /// <value>
        /// The recovery fumbles.
        /// </value>
        public int RecoveryFumbles { get; set; }

        /// <summary>
        /// Gets or sets the time of possession.
        /// </summary>
        /// <value>
        /// The time of possession.
        /// </value>
        public int TimeOfPossession { get; set; }

        /// <summary>
        /// Gets or sets the total first downs.
        /// </summary>
        /// <value>
        /// The total first downs.
        /// </value>
        public int TotalFirstDowns { get; set; }
    }
}