namespace ApiClient
{
    public class PlaySummary
    {
        public float Distance { get; set; }
        public float Angle { get; set; }
        public int Quarter { get; set; }
        public int TimeOnClock { get; set; }
        public string Description { get; set; }
        public double PlayNumber { get; set; }
        public long TeamSeasonId { get; set; }
        public string TeamName { get; set; }
        public int Score { get; set; }
        public bool IsScoring { get; set; }
        public int HomeScore { get; set; }
        public int AwayScore { get; set; }
        public bool IsAdjustment { get; set; }
        public long PlayerId { get; set; }
        public bool IsShot { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}