using System;

namespace ApiClient
{
    public class PlayerResponseModel
    {
        public long PlayerId { get; set; }

        public long TeamSeasonId { get; set; }

        public Guid CreatorGuid { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string JerseyNumber { get; set; }

        public string AlternateJerseyNumber { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime UpdatedOn { get; set; }

        public DateTime? DeletedOn { get; set; }
        public string DisplayName { get; set; }
    }
}