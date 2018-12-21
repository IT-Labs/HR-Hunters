using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IEmailSenderManager
    {
        Task SendEmail(string from, List<string> MailingList);
    }
}
