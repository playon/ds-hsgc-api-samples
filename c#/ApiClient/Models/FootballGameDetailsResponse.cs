using System;
using System.Collections.Generic;

namespace ApiClient
{
    public class FootballGameDetailsResponse
    {       
        public GameResponseModel Details { get; set; }
        public ResponseStatus ResponseStatus { get; set; }

        public long GameId { get; set; }

        public string HomeTeamName { get; set; }
        public string HomeTeamAcronym { get; set; }
        public string HomeTeamMascot { get; set; }
        public string HomeTeamSlug { get; set; }
        public string HomeTeamLogo { get; set; }
        public long HomeTeamId { get; set; }
        public long HomeTeamSeasonId { get; set; }

        public int HomeScore { get; set; }

        public string AwayTeamName { get; set; }
        public string AwayTeamAcronym { get; set; }
        public string AwayTeamMascot { get; set; }
        public string AwayTeamSlug { get; set; }
        public string AwayTeamLogo { get; set; }
        public long AwayTeamId { get; set; }
        public long AwayTeamSeasonId { get; set; }

        public int AwayScore { get; set; }

        public string HomeTeamSchoolSlug { get; set; }
        public string AwayTeamSchoolSlug { get; set; }

        public Status Status { get; set; }
        public GameType GameType { get; set; }
        public DateTime StartTimeUTC { get; set; }
        public DateTime LocalStartTime { get; set; }
        public DateTimeOffset LocalStartTime2 { get; set; }
        public string TimeZone { get; set; }

        public Sport Sport { get; set; }

        public Sex Gender { get; set; }

        public int QuarterSecondsLeft { get; set; }
        public int CurrentQuarter { get; set; }

        public bool HomeTeamHasReporters { get; set; }
        public bool AwayTeamHasReporters { get; set; }
        public bool HasQuickScores { get; set; }

        public string VideoEmbedLink { get; set; }
        public MediaEmbedType VideoEmbedType { get; set; }

        public string AudioEmbedLink { get; set; }
        public MediaEmbedType AudioEmbedType { get; set; }

        public int RegulationPeriodCount { get; set; }

        public int PeriodSecondsLeft { get; set; }

        public int CurrentPeriod { get; set; }

        public List<QuarterScore> PeriodScores { get; set; }

        public List<QuarterScore> AwayPeriodScores { get; set; }

        public List<QuarterScore> HomePeriodScores { get; set; }

        public GameClockStatus ClockStatus { get; set; }

        public string GameDetailLink { get; set; }

        public string StatusDisplay { get; set; }

        public List<QuarterScore> QuarterScores { get; set; }
        public GameStatLeaders GameLeaders { get; set; }
        public IEnumerable<PlayerStats> PlayerStatistics { get; set; }
        public List<PlaySummary> ScoringPlays { get; set; }
        public List<PlaySummary> PlaysInGame { get; set; }
        public List<PlayerResponseModel> Players { get; set; }

        //public List<PlayerStatsTotals> PlayerStats { get; set; }

        public List<QuarterScore> AwayQuarterScores { get; set; }

        public List<QuarterScore> HomeQuarterScores { get; set; }

        public string ClockFriendlyDisplay { get; set; }

        public string CurrentPeriodFriendlyDisplay { get; set; }

        public TeamStatistics HomeTeamStatistics { get; set; }
        public TeamStatistics AwayTeamStatistics { get; set; }
    }
}