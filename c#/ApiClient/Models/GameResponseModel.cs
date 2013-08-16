using System;

namespace ApiClient
{
    public class GameResponseModel
    {
        public long GameId { get; set; }
        public Guid CreatorGuid { get; set; }
        public long AwayTeamSeasonId { get; set; }
        public long HomeTeamSeasonId { get; set; }
        public Sport Sport { get; set; }
        public GameType GameType { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime LocalStartDateTime { get; set; }
        public string TimeZone { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public Status Status { get; set; }
        public string StatusText { get; set; }
        public int QuarterSecondsLeft { get; set; }
        public int CurrentQuarter { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}