import { TemplateConfiguration } from "./templates";

export const respondToRaiMedicaidSpaCms : TemplateConfiguration = {
    name: "respond-to-rai-medicaid-spa-cms",
    subject:  "Medicaid SPA RAI Response for {{id}} Submitted",
    html: `
<p>The OneMAC Submission Portal received a Medicaid SPA RAI Response Submission:</p>
<ul>
<li>The submission can be accessed in the OneMAC application, which you 
can find at <a href='{{applicationEndpoint}}'>this link</a>.</li>
<li>If you are not already logged in, please click the "Login" link 
at the top of the page and log in using your Enterprise User 
Administration (EUA) credentials.</li>
<li>After you have logged in, you will be taken to the OneMAC application. 
The submission will be listed on the dashboard page, and you can view its 
details by clicking on its ID number.</li>
</ul>
<p>
<br><b>State or territory:</b> {{territory}}
<br><b>Name:</b> {{submitterName}}
<br><b>Email:</b> {{submitterEmail}}
<br><b>Medicaid SPA Package ID:</b> {{id}}
</p>
Summary:
<br>{{additionalInformation}}
<br>
<p>
<br>Files:
<br>{{formattedFileList}}
<br>
<p>If the contents of this email seem suspicious, do not open them, and instead 
forward this email to <a href='mailto:SPAM@cms.hhs.gov'>SPAM@cms.hhs.gov</a>.</p>
<p>Thank you!</p>`,
    text: `
The OneMAC Submission Portal received a Medicaid SPA RAI Response Submission:
\n\nThe submission can be accessed in the OneMAC application, which you can 
find at {{applicationEndpoint}}.\n\n
If you are not already logged in, please click the "Login" link at the top 
of the page and log in using your Enterprise User Administration (EUA) 
credentials.\n\n
After you have logged in, you will be taken to the OneMAC application. 
The submission will be listed on the dashboard page, and you can view its 
details by clicking on its ID number.\n\n
State or territory: {{territory}}\n
Name: {{submitterName}}\n
Email: {{submitterEmail}}\n
Medicaid SPA Package ID: {{id}}\n
\n\n
Summary:\n
{{additionalInformation}}\n\n
Files:\n
{{textFileList}}\n\n
If the contents of this email seem suspicious, do not open them, and instead 
forward this email to SPAM@cms.hhs.gov.\n\n
Thank you!`,
};

export const respondToRaiMedicaidSpaState : TemplateConfiguration = {
    name: "respond-to-rai-medicaid-spa-state",
    subject:  "Your Medicaid SPA RAI Response for {{id}} has been submitted to CMS",
    html: `
<p>This response confirms you submitted a Medicaid SPA RAI Response to CMS for review:</p>
<p>
<br><b>State or territory:</b> {{territory}}
<br><b>Name:</b> {{submitterName}}
<br><b>Email Address:</b> {{submitterEmail}}
<br><b>Medicaid SPA ID:</b> {{id}}
<br><b>90th Day Deadline:</b> {{ninetyDaysDateNice}}
</p>
Summary:
<br>{{additionalInformation}}
<br>
<p>This response confirms receipt of your Medicaid State Plan Amendment (SPA 
or your response to a SPA Request for Additional Information (RAI)). You can 
expect a formal response to your submittal to be issued within 90 days, 
before {{ninetyDaysDateNice}}.</p>
<p>This mailbox is for the submittal of State Plan Amendments and non-web 
based responses to Requests for Additional Information (RAI) on submitted 
SPAs only. Any other correspondence will be disregarded.</p>
<p>If you have questions, please contact 
<a href='mailto:SPA@cms.hhs.gov'>SPA@cms.hhs.gov</a>.</p>
<p>Thank you!</p>`,
    text: `
This response confirms you submitted a Medicaid SPA RAI Response to CMS for review:\n\n
State or territory: {{territory}}\n
Name: {{submitterName}}\n
Email Address: {{submitterEmail}}\n
Medicaid SPA ID: {{id}}\n
90th Day Deadline: {{ninetyDaysDateNice}}\n
\n
Summary:\n
{{additionalInformation}}\n\n
This response confirms receipt of your Medicaid State Plan Amendment (SPA 
or your response to a SPA Request for Additional Information (RAI)). You can 
expect a formal response to your submittal to be issued within 90 days, 
before {{ninetyDaysDateNice}}.\n\n
This mailbox is for the submittal of State Plan Amendments and non-web 
based responses to Requests for Additional Information (RAI) on submitted 
SPAs only. Any other correspondence will be disregarded.\n\n
If you have questions, please contact SPA@cms.hhs.gov.\n\n
Thank you!`,
};