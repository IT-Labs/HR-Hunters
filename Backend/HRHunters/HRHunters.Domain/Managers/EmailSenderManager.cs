using Amazon.S3;
using HRHunters.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Amazon.SimpleEmail.Model;
using HRHunters.Common.Constants;
using Amazon.SimpleEmail;
using Amazon.Runtime;
using Amazon;
using HRHunters.Common.Entities;
using Microsoft.AspNetCore.Identity;
using HRHunters.Common.Responses;
using HRHunters.Common.HelperMethods;

namespace HRHunters.Domain.Managers
{
    public class EmailSenderManager : IEmailSenderManager
    {
        private readonly UserManager<User> _userManager;
        private readonly IEmailTemplate _emailTemplate;
        public EmailSenderManager(UserManager<User> userManager, IEmailTemplate emailTemplate)
        {
            _userManager = userManager;
            _emailTemplate = emailTemplate;
        }
        public async Task<GeneralResponse> SendEmail(Applicant applicant, JobPosting jobPosting)
        {
            var numOfApplication = applicant.Applications.Count;
            using (var client = new AmazonSimpleEmailServiceClient(new EnvironmentVariablesAWSCredentials(), RegionEndpoint.USWest2))
            {
                var sendRequest = new SendEmailRequest
                {
                    Source = ConstantStrings.EMAIL_SENDER,
                    Destination = new Destination
                    {
                        ToAddresses =
                        new List<string> { applicant.User.Email }
                    },
                    Message = new Message
                    {
                        Subject = new Content("New job post application"),
                        Body = new Body
                        {
                            Html = new Content
                            {
                                Charset = "UTF-8",
                                Data = _emailTemplate.NewApplicantAppliedTemplate(applicant, jobPosting)
                            },
                            Text = new Content
                            {
                                Charset = "UTF-8",
                                Data = $"Congratulations on your {numOfApplication}{(numOfApplication == 1 ? "st" : numOfApplication == 2 ? "nd" : numOfApplication == 3 ? "rd" : "th")} application, {applicant.User.FirstName}!" +
                                        "You have just applied for the following Job:" +
                                        $"Position: {jobPosting.Title}" +
                                        "You can see all your job applications on http://dev-docker:9014/applicant/my-applications" +
                                        "Sincerely, HRHunters"
                            }
                        }
                    },
                };
                var generalResponse = new GeneralResponse();
                var emailResponse = new SendEmailResponse();
                try
                {
                    emailResponse = await client.SendEmailAsync(sendRequest);
                    generalResponse.Succeeded = true;
                    return generalResponse;
                }
                catch (Exception e)
                {
                    return generalResponse.ErrorHandling<EmailSenderManager>(emailResponse.MessageId, objects: (sendRequest, e));
                }
            }
        }
        public async Task<GeneralResponse> SendEmail(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.Contains(RoleConstants.APPLICANT) ? "Applicant" : "Client";
            var totalUsersInRole = await _userManager.GetUsersInRoleAsync(role);
            using (var client = new AmazonSimpleEmailServiceClient(new EnvironmentVariablesAWSCredentials(), RegionEndpoint.USWest2))
            {
                var sendRequest = new SendEmailRequest
                {
                    Source = ConstantStrings.EMAIL_SENDER,
                    Destination = new Destination
                    {
                        ToAddresses =
                        new List<string> { ConstantStrings.EMAIL_RECIEVER }
                    },
                    Message = new Message
                    {
                        Subject = new Content("New user registration"),
                        Body = new Body
                        {
                            Html = new Content
                            {
                                Charset = "UTF-8",
                                Data = await _emailTemplate.NewUserTemplate(user)
                            },
                            Text = new Content
                            {
                                Charset = "UTF-8",
                                Data = $"New {role} has just registered!" +
                                        $"Dear Admin," +
                                        $"This email was sent to you to notify when a user is registered on your website." +
                                        $"The new {role} with email {user.Email} became the {totalUsersInRole.Count + " "}{role} on your application!"

                            }
                        }
                    },
                };
                var emailResponse = new SendEmailResponse();
                var generalResponse = new GeneralResponse();
                try
                {
                    emailResponse = await client.SendEmailAsync(sendRequest);
                    generalResponse.Succeeded = true;
                    return generalResponse;
                }
                catch(Exception e)
                {
                    return generalResponse.ErrorHandling<EmailSenderManager>(emailResponse.MessageId, objects: (sendRequest, e));
                }
            }
        }
    }
}
