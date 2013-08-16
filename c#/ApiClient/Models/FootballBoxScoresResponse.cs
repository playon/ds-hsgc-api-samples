using System.Collections.Generic;

namespace ApiClient
{
    public class FootballBoxScoresResponse
    {
        public List<FootballGameDetailsResponse> BoxScores { get; set; }
        public int TotalCount { get; set; }
    }
}