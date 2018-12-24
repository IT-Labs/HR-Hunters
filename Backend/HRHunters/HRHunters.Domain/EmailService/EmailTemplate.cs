using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRHunters.Domain.EmailService
{
    public class EmailTemplate : IEmailTemplate
    {
        public IEmailContent _content { get; set; }
        public EmailTemplate(IEmailContent content)
        {
            _content = content;
        }

        public async Task<string> NewUserTemplate(User user)
        {
            return $@"<html>
                        <head></head>
                        <body style='margin: 0; padding: 0; background-color: transparent; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif'>
                            <table cellpadding='0' cellspacing='0' width='100%'>
                                <tr style='background-color: #23282d; color: white;'>
                                    <td style='padding: 20px; width: 100px'>
                                        <img
                                            src='https://i.imgur.com/GtTlwZh.png'
                                            alt='HR logo'
                                            style='height: 85px; width: 85px'
                                        />
                                    </td>
                                    <td style='font-size: 30px;'>HR Hunters</td>
                                </tr>
                            </table>
                            <table cellpadding='0' cellspacing='0' width='100%'>
                                {await _content.NewUserContent(user)}
                            </table>
                                            
                        </body>
                    </html>";
        }

        public string NewApplicantAppliedTemplate(Applicant applicant, JobPosting jobPosting)
        {
            return $@"<html>
                        <head></head>
                        <body style='margin: 0; padding: 0; background-color: transparent; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif'>
                            <table cellpadding='0' cellspacing='0' width='100%'>
                                <tr style='background-color: #23282d; color: white;'>
                                    <td style='padding: 20px; width: 100px'>
                                        <img
                                            src='https://i.imgur.com/GtTlwZh.png'
                                            alt='HR logo'
                                            style='height: 85px; width: 85px'
                                        />
                                    </td>
                                    <td style='font-size: 30px;'>HR Hunters</td>
                                </tr>
                            </table>
                            <table cellpadding='0' cellspacing='0' width='100%'>
                                {_content.NewApplicationContent(applicant, jobPosting)}
                            </table>
                                            
                        </body>
                    </html>";
        }
    }
}
