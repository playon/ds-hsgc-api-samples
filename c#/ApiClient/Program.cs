using System;
using System.Linq;
using System.Net;
using System.Text;
using RestSharp;

namespace ApiClient
{
    class Program
    {
        private const int PageSize = 2048;
        private const string ApiRoot = "http://api.hsgamecenter.com/v1.2";
        private const string Username = "";
        private const string Password = "";
        //this is the identifier that relates seasons together, i.e. the high school 2013 football season
        //it can be obtained from http://api.hsgamecenter.com/json/metadata?op=GetUniversalSeasons
        private const int CurrentUniversalSeasonId = 6;

        private static RestClient _restClient;
        static void Main(string[] args)
        {
            _restClient = new RestClient(ApiRoot);

            var authToken = Authenticate();
            GetBoxScores(authToken);
            

            Console.WriteLine("Done. Press any key to continue");
            Console.ReadLine();
        }

        private static void GetBoxScores(string authToken)
        {
            var start = 0;
            while (true)
            {
                var request = new RestRequest("/user/teams/football/boxScores");
                request.AddHeader("Authorization", authToken);
                request.AddObject(new GetUserTeamsFootballBoxScores { Offset = start, Count = PageSize });
                var response = _restClient.Execute<FootballBoxScoresResponse>(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    foreach (var boxScore in response.Data.BoxScores)
                    {
                        var text = boxScore.AwayTeamName + " @ " + boxScore.HomeTeamName + " - " + boxScore.StatusDisplay;
					    if (boxScore.Status == Status.Complete) {
						    text = text + " (" + boxScore.AwayTeamAcronym + " " + boxScore.AwayScore + ", " + boxScore.HomeTeamAcronym + " " + boxScore.HomeScore + ")";
					    }
                        Console.WriteLine(text);
                    }
                    if (response.Data.BoxScores.Count == 0 || response.Data.BoxScores.Count() == response.Data.TotalCount)
                        break;
                    start += response.Data.BoxScores.Count;
                }
                else if (response.StatusCode == HttpStatusCode.Unauthorized)
                    throw new Exception("Auth token expired.  Reauthenticate");
                else
                    throw new Exception(string.Format("Error getting box scores: {0}", response.StatusCode));
            }                             
        }

        private static string Authenticate()
        {
            var request = new RestRequest("/authenticate", Method.POST);
            request.AddObject(new Authenticate { Username = Username, Password = Password });
            var response = _restClient.Execute<AuthenticateResponse>(request);
            if (response.StatusCode == HttpStatusCode.OK)
                return response.Data.AuthToken;
            else if (response.StatusCode == HttpStatusCode.Unauthorized)
                throw new Exception("Invalid username/password");
            else
                throw new Exception(string.Format("Error calling authenticate: {0}", response.StatusCode));
        }
    }
}
