using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace HRHunters.Domain.EmailService
{
    public class EmailContent : IEmailContent
    {
        private readonly UserManager<User> _userManager;
        public EmailContent(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public string NewApplicationContent(Applicant applicant, JobPosting jobPosting)
        {
            var numOfApplication = applicant.Applications.Count;
            return $@"<tr>
                        <td style='color: #23282d; font-size: 20px; font-weight: bold; padding: 20px'>
                            Congratulations on your {numOfApplication}{(numOfApplication == 1 ? "st" : numOfApplication == 2 ? "nd" : numOfApplication == 3 ? "rd" : "th")} application, {applicant.User.FirstName}!<br>
                        </td>     
                      </tr>
                      <tr>
                        <td style='color: #23282d; font-size: 16px; padding: 20px'>
                            You have just applied for the following Job: <strong>{jobPosting.Title}</strong><br>
                            You can see all your job applications <a href='http://dev-docker:9014/applicant/my-applications' target='_top' style='color:#37b3ad; text-decoration: none'>here.</a>
                            <br><br>
                            Sincerely,
                            HRHunters
                        </td>
                      </tr>";
        }

        public async Task<string> NewUserContent(User user)
        {
            var role = (await _userManager.GetRolesAsync(user)).Contains(RoleConstants.APPLICANT) ? "Applicant" : "Client";
            var totalUsersInRole = await _userManager.GetUsersInRoleAsync(role);
            return $@"<tr>
                        <td style='color: #23282d; font-size: 30px; font-weight: bold; padding: 20px'>
                            New {role} has just registered!
                        </td>
                     </tr>
                     <tr>
                        <td style='color: #23282d; font-size: 16px; padding: 20px'>
                        Dear Admin, <br>
                        This email was sent to you to notify when a user is registered on your website.<br>
                        The new {role} with email <a href='mailto:{user.Email}' target='_top'>{user.Email}</a> became the {totalUsersInRole.Count + " "}{role} on your application!<br>
                        </td>
                    </tr>";
        }
    }
}