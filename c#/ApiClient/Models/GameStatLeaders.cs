using System;

namespace ApiClient
{
    public class GameStatLeaders
    {

        public Tuple<long, PassingStats> HomeTeamPassingLeader { get; set; }
        public Tuple<long, PassingStats> AwayTeamPassingLeader { get; set; }
        public Tuple<long, RushingStats> HomeTeamRushingLeader { get; set; }
        public Tuple<long, RushingStats> AwayTeamRushingLeader { get; set; }
        public Tuple<long, ReceivingStats> HomeTeamReceivingLeader { get; set; }
        public Tuple<long, ReceivingStats> AwayTeamReceivingLeader { get; set; }
    }
}