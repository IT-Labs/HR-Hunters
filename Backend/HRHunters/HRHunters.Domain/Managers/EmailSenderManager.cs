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

namespace HRHunters.Domain.Managers
{
    public class EmailSenderManager : IEmailSenderManager
    {
        private readonly IAmazonS3 _amazonClient;
        public EmailSenderManager(IAmazonS3 amazonClient)
        {
            _amazonClient = amazonClient;
        }

        public Task SendEmail()
        {
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
                        Subject = new Content(ConstantStrings.subject),
                        Body = new Body
                        {
                            Html = new Content
                            {
                                Charset = "UTF-8",
                                Data = ConstantStrings.htmlBody
                            },
                            Text = new Content
                            {
                                Charset = "UTF-8",
                                Data = ConstantStrings.textBody
                            }
                        }
                    },
                };
                try
                {
                    var response = client.SendEmailAsync(sendRequest);
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.Message);
                    throw;
                }
            }

            return Task.CompletedTask;
        }
    }
}
