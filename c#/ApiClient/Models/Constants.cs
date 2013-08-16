using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ApiClient
{
    public enum Status
    {
        Scheduled,
        InProgress,
        Complete,
        NoData,
        Cancelled,
        Postponed,
        Delayed
    }
    public enum GameType
    {
        Undefined = -1,
        [Obsolete]
        Preseason = 0,
        Scrimmage = 1,
        RegularSeason = 2,
        Postseason = 3,
        Tournament = 4
    }
    public enum SportLevel
    {
        Undefined = -1,
        School = 0,
        College = 1,
        Professional = 2,
        International = 3,
        Other = 4,
        SemiPro = 5,
        AAU = 6, // Suck it Resharper
        Recreational = 7
    }
    public enum Sex
    {
        Undefined = -1,
        Male = 0,
        Female = 1,
        Coed = 3
    }

    /// <summary>
    /// Age/experience level.
    /// 
    /// Examples: JV, Varsity, U12, Professional
    /// </summary>
    public enum Level
    {
        Undefined = -1,
        Freshman = 0,

        /// <summary>
        /// JV (Junior Varsity)
        /// </summary>
        JV = 1,
        Varsity = 2
    }

    public enum Sport
    {
        Undefined = -1,
        Football = 0,
        Basketball = 1
    }
    public enum MediaEmbedType
    {
        Undefined = 0,
        AlwaysVisible = 1,
        HiddenBeforeGame = 2,
        HiddenAfterGame = 3,
        VisibleDuringGameOnly = 4
    }
    public enum GameClockStatus
    {
        GameNotStarted,
        Running,
        PeriodEnded,
        Timeout,
        InjuryTimeout,
        OfficialTimeout,
        GameEnded
    }
}
