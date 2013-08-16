using System;

namespace ApiClient
{
    public class GetUserTeamsFootballBoxScores
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UniversalSeasonId { get; set; }

        public bool IncludeLeaders { get; set; }
        public bool IncludeTeamAggregates { get; set; }

        public int Offset { get; set; }
        public int Count { get; set; }
    }
}