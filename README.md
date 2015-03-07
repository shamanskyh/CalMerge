# CalMerge
ICS merging and (limited) access control for public Calendars. Can also act as a proxy between iCloud and Google Calendar. Runs on a LAMP stack.

## Installation
NOTE: If you don't know what a LAMP stack is, it's best to read up on that first. If you're just starting out, feel free to get in touch with me and I can try to answer any questions you have! Also note that your LAMP stack must support cURL to access external URLs and that some providers block this functionality in their basic plans.

1. Create a new MySQL database and import the database structure found in `Database/Database.sql`
2. Upload the files in the PHP folder to a directory on your server — most likely a folder that a subdomain points to.
3. Modify `PHP/config.php`:
	- Add your username, password, and database name
	- Change the sharePrefix. This is the URL that users will import your calendar with and needs to correspond to the URL rewriting that goes on in `.htaccess`.
	- Change the name of the merged output if you desire.
4. Modify `PHP/index.php`:
	- This is just a page that redirects people if they just type in the initial part of the share URL. It could redirect to your homepage or something like Google.
5. Modify the `.htaccess` file. Many operating systems see this as a hidden file, so be sure that it gets uploaded. This rewrites URLs into a nicer format and restricts access to settings. You will need to create an `.htpasswd` file that this links to. Some providers have a built in utility to do this. In that case, it might be easiest to delete the `AuthName` and `AuthUserFile` lines and use their utility.
6. Be sure to create an `.htpasswd` file that protects the files in the `admin` folder.

## Use
1. Navigate to `admin/index.php`
2. If using a service like iCloud, create public share links of all the calendars you intend to merge.![](http://i59.tinypic.com/10f13ir.png)
3. Add calendars with the "+" button in the top right of the "Calendars" panel. Each calendar should have a name, a URL, and a color (in HEX, without the pound sign).
4. Add viewers with the "+" button in the top right of the "Viewers" panel. Each viewer gets a name and a list of Calendars that they should have read access to. Modify their access through the checkboxes that appear under their name.
5. Note that events may take up to 48 hours to process in Google Calendar. This is because they aggressively cache subscribed calendars.

## Known Issues / To-Dos
- It would be great to have a color picker when adding a new calendar. Or a service that attempts to recognize the color that's already been set for the calendar.
- Timezone support is seriously lacking. For right now, known timezones exist in a static file called `timezones.txt` that is placed at the top of every merge output. A better implementation would aggregate timezones from calendars being merged.