/* eslint-disable max-len */
export const ReleaseFeedRSSContent = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom" ><generator uri="https://jekyllrb.com/" version="3.10.0">Jekyll</generator><link href="https://airdcpp-web.github.io/feed.xml" rel="self" type="application/atom+xml" /><link href="https://airdcpp-web.github.io/" rel="alternate" type="text/html" /><updated>2025-07-25T17:19:16+03:00</updated><id>https://airdcpp-web.github.io/feed.xml</id><title type="html">AirDC++ Web Client</title><subtitle>A peer-to-peer file sharing client with a responsive web user interface for frequent sharing of files and directories within groups of people.
</subtitle><entry><title type="html">Web Client 2.14.0 Beta</title><link href="https://airdcpp-web.github.io/2025/07/25/version-2.14.0-beta.html" rel="alternate" type="text/html" title="Web Client 2.14.0 Beta" /><published>2025-07-25T15:15:00+03:00</published><updated>2025-07-25T15:15:00+03:00</updated><id>https://airdcpp-web.github.io/2025/07/25/version-2.14.0-beta</id><content type="html" xml:base="https://airdcpp-web.github.io/2025/07/25/version-2.14.0-beta.html"><![CDATA[<!--more-->

<h2 id="changelog">Changelog</h2>

<h3 id="common">Common</h3>

<ul>
  <li>Add context menu items for granting slots (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/509">#509</a>)</li>
  <li>Add new form field types (email, URL, password)</li>
</ul>

<h3 id="web-client-2140">Web Client 2.14.0</h3>

<ul>
  <li>Fix various issues with multiple per-user connections</li>
  <li>Fix handling of hub redirections</li>
  <li>Remove confusing “No files available” and “No free block” messages for downloads</li>
  <li>Skip download limit checks (e.g. max download speed) when a new segment is assigned for a connection</li>
  <li>Detect auto speed limits correctly from the limiter values</li>
  <li>Fix an application freeze when sharing items with certain special characters (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/500">#500</a>)</li>
  <li>Don’t follow symbolic links pointing to files/directories inside shared directories (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/507">#507</a>)</li>
  <li>Fix sending of custom user ADC supports</li>
  <li>View file API: add “view_file_created” subscription for consistency, “view_file_added” is now deprecated</li>
</ul>

<h3 id="web-ui-2140">Web UI 2.14.0</h3>

<ul>
  <li>Readd “Browse content” and “Result details” in the search result file column action menu (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/507">#507</a>)</li>
  <li>Don’t show the “Copy size” menu item when it can’t be used</li>
</ul>

<h2 id="beta-builds-linux"><a href="http://web-builds.airdcpp.net/develop/">Beta builds (Linux)</a></h2>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">Web Client 2.13.3</title><link href="https://airdcpp-web.github.io/2025/01/19/version-2.13.3.html" rel="alternate" type="text/html" title="Web Client 2.13.3" /><published>2025-01-19T17:55:00+02:00</published><updated>2025-01-19T17:55:00+02:00</updated><id>https://airdcpp-web.github.io/2025/01/19/version-2.13.3</id><content type="html" xml:base="https://airdcpp-web.github.io/2025/01/19/version-2.13.3.html"><![CDATA[<!--more-->

<h2 id="changelog">Changelog</h2>

<h3 id="web-client-2133">Web Client 2.13.3</h3>

<ul>
  <li>Remove finished idle download connections instantly instead of putting them in the “Disconnected” state</li>
  <li>Fix loading of viewed files that are also in queue (but not yet finished)</li>
  <li>Build: add support for Boost 1.87</li>
  <li>Portable builds: update to Buildroot 2024.11.1,</li>
  <li>Portable builds: the 64-bit version supports older CPUs without SSE 4.x again (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/496">#496</a>)</li>
</ul>

<h3 id="web-ui-2131">Web UI 2.13.1</h3>

<ul>
  <li>Re-add total sizes for share profiles listed under “Browse own share…”</li>
  <li>Fix “Browse files” action for share profiles</li>
  <li>Update the page URL correctly when pressing “Cancel” in the download target browse dialog (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/494">#494</a>)</li>
  <li>Use a new charting library in the transfer widget (the previous one is no longer maintained)</li>
  <li>Trim text fields in forms</li>
  <li>Fix saving of hub’s userlist visibility state</li>
  <li>Small file browser dialog tweaks</li>
  <li>Prevent table filters from stealing focus when a previously empty table is being rendered</li>
</ul>

<h2 id="download-links-linux"><a href="/docs/installation/linux-binaries.html">Download links (Linux)</a></h2>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">Web Client 2.13.2</title><link href="https://airdcpp-web.github.io/2024/12/07/version-2.13.2.html" rel="alternate" type="text/html" title="Web Client 2.13.2" /><published>2024-12-07T19:45:00+02:00</published><updated>2024-12-07T19:45:00+02:00</updated><id>https://airdcpp-web.github.io/2024/12/07/version-2.13.2</id><content type="html" xml:base="https://airdcpp-web.github.io/2024/12/07/version-2.13.2.html"><![CDATA[<!--more-->

<p>Version 2.13.x focuses on modernizing the core application codebase and providing new API features for developers.</p>

<h2 id="adc-commands-api">ADC commands API</h2>

<p>The new ADC commands allows developers to interact directly with the <a href="https://adc.sourceforge.io/ADC.html">ADC protocol</a> via hubs or directory with other clients over TCP or UDP protocol.</p>

<p>It’s possible to send ADC commands, read incoming ADC commands and add new parameters in outgoing commands. It’s also possible to advertise custom protocol supports to hubs/other clients so it’s fully possible to design and implement  new ADC protocol extensions!</p>

<h3 id="example-code">Example code</h3>

<p>Here’s a very simplied version of an imaginary partial file sharing extension demonstrating a way to exchange information between the clients about finished files that aren’t shared yet. Note that there’s actual partial sharing functionality already implement in the client and it’s a lot more complicated than this.</p>

<h2 id="changelog">Changelog</h2>

<h3 id="common">Common</h3>

<ul>
  <li>Dupe detection is more accurate (new dupe types)</li>
  <li>Allow adding custom context menu items for sessions (hubs, private chats, filelists, viewed files)</li>
  <li>Add generic window-specific menu item contexts (events, queue, favorite hubs, share, transfers)</li>
  <li>Allow installed extensions to be disabled (no autostart)</li>
</ul>

<h3 id="web-client-2132">Web Client 2.13.2</h3>

<p><strong>API</strong></p>

<ul>
  <li><strong>New API module</strong>: <a href="https://airdcpp.docs.apiary.io/#reference/adc-commands/add-search-type">ADC commands</a></li>
  <li>Share API: add endpoints for fetching share content information by real path (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/438">#438</a>)</li>
  <li>Queue and Share APIs: add methods for getting files by TTH</li>
  <li>Hash API: add listeners for successfully hashed and failed files</li>
  <li>Share and filelist APIs: add hooks for filtering filelist directories/files and search results (<a href="https://github.com/airdcpp/airdcpp-windows/discussions/126">#126</a>)</li>
  <li>Search API: add listener for incoming searches</li>
  <li>Search API: add various new fields for user search results (non-grouped results)</li>
  <li>Hub API: Add ADC support fields for hubs and hub users</li>
  <li>Min and max size can now be set simultaneously for search queries</li>
</ul>

<p><strong>Core</strong></p>

<ul>
  <li>Ensure that the excluded directory always contains trailing slash</li>
  <li>Show spam rate when receiving CTM/search/incoming connection flood</li>
  <li>Fix possible issues with identical CIDs being generated for different clients</li>
  <li>Fix a crash when launching the app on the latest FreeBSD versions</li>
  <li>Various filelist-related bug and crash fixes</li>
  <li>Prevent adding duplicate search extensions for search types</li>
  <li>Idle (finished) download connections can now be forced</li>
  <li>Ensure that no duplicate search results are being sent</li>
  <li>Parse HBRI validation addresses received from the hub with the correct IP protocol</li>
  <li>Build: rewrite build scripts</li>
  <li>Other misc stability fixes</li>
  <li>Remove support for loading of legacy XML web server settings (the new format was added in Web Client 2.11.0)</li>
  <li>Partial file sharing is no longer available in NMDC hubs</li>
  <li>Fix setting of thread priorities</li>
  <li>Allow specifying a custom resource directory in dcppboot.xml, improve handling of relative paths</li>
  <li>Fix cases where the refreshing symbol was shown in the UI even after the refresh was completed</li>
  <li>Portable builds: fix debugging symbols</li>
</ul>

<h3 id="web-ui-2130">Web UI 2.13.0</h3>

<ul>
  <li>Allow cloning share profiles</li>
  <li>Fix adding of search types (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/473">#473</a>)</li>
  <li>Fix bugs with loading/moving of Home layout widgets</li>
  <li>Change a few help URLs to use HTTPS</li>
  <li>Determine the UI height correctly on mobile devices (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/483">#483</a>)</li>
  <li>Correct the help link for setting variables (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/477">#477</a>)</li>
  <li>Fix various issues with the hinted user form field type in custom forms</li>
</ul>

<h2 id="download-links-linux"><a href="/docs/installation/linux-binaries.html">Download links (Linux)</a></h2>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">Web Client 2.12.2</title><link href="https://airdcpp-web.github.io/2024/07/07/version-2.12.2.html" rel="alternate" type="text/html" title="Web Client 2.12.2" /><published>2024-07-07T11:00:00+03:00</published><updated>2024-07-07T11:00:00+03:00</updated><id>https://airdcpp-web.github.io/2024/07/07/version-2.12.2</id><content type="html" xml:base="https://airdcpp-web.github.io/2024/07/07/version-2.12.2.html"><![CDATA[<!--more-->

<h2 id="changelog">Changelog</h2>

<h3 id="web-client-2122">Web Client 2.12.2</h3>

<ul>
  <li>Allow the operating system to choose the default listening ports instead of assigning random ones</li>
  <li>Pick the most common filename for the grouped file search results (<a href="https://github.com/airdcpp/airdcpp-windows/issues/113">#113</a>)</li>
  <li>More reliable extension engine detection on Linux</li>
  <li>Show a proper error message for unclean TLS connection closures</li>
  <li>Lower the default minimum search interval</li>
  <li>Lower the auto reconnect delay on severe flood</li>
  <li>API: fix context menu item select events for message highlights</li>
  <li>API: entry file shouldn’t be required for remote extensions</li>
  <li>Build: the nlohmann JSON library is no longer included with the source (<strong>new build dependency</strong>)</li>
  <li>Build: add support for miniupnpc 2.2.8</li>
  <li>Change the license to GPLv3</li>
</ul>

<h3 id="web-ui-2121">Web UI 2.12.1</h3>

<ul>
  <li>Add “Copy” context submenu for downloadable item</li>
  <li>Show additional connection information on the auto detection page</li>
  <li>Fix the event count label color for warnings</li>
  <li>Fix incorrect values being changed on setting pages that contain multiple forms</li>
  <li>Fix the notification message when adding/removing ignored users</li>
  <li>Fix /me chat command</li>
  <li>File browser: disable autofocus for the filename input (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/462">#462</a>)</li>
</ul>

<h2 id="download-links-linux"><a href="/docs/installation/linux-binaries.html">Download links (Linux)</a></h2>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">AirDC++ 4.21 for Windows</title><link href="https://airdcpp-web.github.io/2023/08/27/airdc-4.21.html" rel="alternate" type="text/html" title="AirDC++ 4.21 for Windows" /><published>2023-08-27T12:00:00+03:00</published><updated>2023-08-27T12:00:00+03:00</updated><id>https://airdcpp-web.github.io/2023/08/27/airdc-4.21</id><content type="html" xml:base="https://airdcpp-web.github.io/2023/08/27/airdc-4.21.html"><![CDATA[<!--more-->

<h2 id="changelog">Changelog</h2>

<h2 id="api-and-web-ui-changes-web-client-2120">API and Web UI changes: <a href="http://airdcpp.net/2023/05/22/version-2.12.0.html">Web Client 2.12.0</a></h2>

<h2 id="added">Added</h2>

<ul>
  <li>Add flood limits for incoming and outgoing connect requests to avoid crashes in case of severe flood (<a href="https://github.com/airdcpp/airdcpp-windows/issues/63">#63</a>)</li>
  <li>Add “verbose” status message severity</li>
</ul>

<h2 id="changed">Changed</h2>

<ul>
  <li>Update Node.js to version 18.17.1</li>
  <li>Lower the default minimum search interval to 5/10 seconds</li>
</ul>

<h2 id="fixed">Fixed</h2>

<ul>
  <li>Fix transfer connections not being created in some cases when download sources are added</li>
  <li>Fix sources column in download queue not being updated in some cases when download sources are added</li>
  <li>Fix an additional whitespace being added after user nicks in some cases</li>
  <li>Fix “engname” country format param (<a href="https://github.com/airdcpp/airdcpp-windows/issues/88">#88</a>)</li>
</ul>

<h2 id="download-links"><a href="/docs/installation/windows.html">Download links</a></h2>

<p>Note that existing AirDC++ users should use the inbuilt updating function (<em>File</em> -&gt; <em>Update check</em>).</p>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">Web Client 2.12.1</title><link href="https://airdcpp-web.github.io/2023/05/22/version-2.12.0.html" rel="alternate" type="text/html" title="Web Client 2.12.1" /><published>2023-05-22T19:30:00+03:00</published><updated>2023-05-23T21:30:00+03:00</updated><id>https://airdcpp-web.github.io/2023/05/22/version-2.12.0</id><content type="html" xml:base="https://airdcpp-web.github.io/2023/05/22/version-2.12.0.html"><![CDATA[<!--more-->

<h2 id="changelog">Changelog</h2>

<h2 id="common">Common</h2>

<ul>
  <li>Use a submenu for extension context menu items when there is more than one item to show</li>
  <li>Add types for chat status messages to allow different formatting/caching behavior</li>
  <li>Prevent UI table filters from getting out of sync with the backend (fixes filter issues in search and filelists)</li>
  <li>Add “verbose” status message severity</li>
</ul>

<h3 id="web-client-2121">Web Client 2.12.1</h3>

<ul>
  <li>Fix an encoding issue that breaks fetching of cached hub messages in NMDC hubs in some cases</li>
</ul>

<h3 id="web-client-2120">Web Client 2.12.0</h3>

<ul>
  <li>Add flood limits for incoming and outgoing connect requests to avoid crashes in case of severe flood (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/450">#450</a>)</li>
  <li>Fix transfer connections not being created in some cases when download sources are added (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/447">#447</a>)</li>
  <li>Fix a missing error message when connecting to an NMDC hub and the nick is taken (affects mostly hubs running on Ptokax)</li>
  <li>Fix an additional whitespace being added after user nicks in some cases</li>
  <li>API: allow chat status messages to be sent to a specific UI instance</li>
  <li>API: add an API method for listing hook subscribers</li>
  <li>API: add dupe information for files/directories in own filelist</li>
  <li>Build: fix build warnings with the latest Clang version</li>
</ul>

<h3 id="web-ui-2120">Web UI 2.12.0</h3>

<ul>
  <li>Use darker color for directory dupes in message views</li>
  <li>Fix unread private message counts being displayed incorrectly in some cases</li>
  <li>Style fixes</li>
</ul>

<h2 id="download-links-linux"><a href="/docs/installation/linux-binaries.html">Download links (Linux)</a></h2>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">AirDC++ 4.20 for Windows</title><link href="https://airdcpp-web.github.io/2023/03/13/airdc-4.20.html" rel="alternate" type="text/html" title="AirDC++ 4.20 for Windows" /><published>2023-03-13T17:30:00+02:00</published><updated>2023-03-13T17:30:00+02:00</updated><id>https://airdcpp-web.github.io/2023/03/13/airdc-4.20</id><content type="html" xml:base="https://airdcpp-web.github.io/2023/03/13/airdc-4.20.html"><![CDATA[<!--more-->

<h2 id="changelog">Changelog</h2>

<h2 id="api-and-web-ui-changes">API and Web UI changes:</h2>

<ul>
  <li><a href="http://airdcpp-web.github.io/2023/03/11/version-2.11.4.html">Web Client 2.11.4</a></li>
  <li><a href="http://airdcpp-web.github.io/2022/12/02/version-2.11.3.html">Web Client 2.11.3</a></li>
</ul>

<h2 id="added">Added</h2>

<ul>
  <li>Report certain incorrectly forwarded ADC protocol messages</li>
  <li>Add a new hublist server (hublist.pwiam.com)</li>
  <li>New language: Ukrainian</li>
  <li>Add extension support in chat views (highlights and context menu items)</li>
</ul>

<h2 id="changed">Changed</h2>

<ul>
  <li>Discussion forum and issue tracker links now point to Github</li>
  <li>Put extension context menu items under an extension-specific submenu in if there are more than two menu items</li>
  <li>Improve logging of partial filelist transfers</li>
  <li>Disable maximum size for shared files when using the RAR profile</li>
  <li>Update Node.js to version 18.15.0</li>
</ul>

<h2 id="fixed">Fixed</h2>

<ul>
  <li>Fix a filelist-related crash (<a href="https://bugs.launchpad.net/airdcpp/+bug/1944724">LP#1944724</a>)</li>
  <li>Fix saving of web server settings (<a href="https://bugs.launchpad.net/airdcpp/+bug/1950519">LP#1950519</a>)</li>
  <li>Remove additional waiting time when using “Find and view NFO” and no results are found</li>
  <li>Don’t clear user commands when attempting to connect to a hub that is open already (<a href="https://bugs.launchpad.net/airdcpp/+bug/1981763">LP#1981763)</a>)</li>
  <li>SOCKS5: don’t fail if the proxy server doesn’t send any port for regular connect attempts</li>
  <li>Remove non-existing commands from /help</li>
  <li>Don’t ignore filenames containing semicolons in SFV files</li>
</ul>

<h2 id="removed">Removed</h2>

<ul>
  <li>The “Search sites” feature has been replaced with an extension (must be installed manually)</li>
  <li>Remove warnings for old LuaDCH hubsoft version</li>
  <li>Removed an inaccessible hublist server address</li>
</ul>

<h2 id="download-links"><a href="/docs/installation/windows.html">Download links</a></h2>

<p>Note that existing AirDC++ users should use the inbuilt updating function (<em>File</em> -&gt; <em>Update check</em>).</p>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">Web Client 2.11.4</title><link href="https://airdcpp-web.github.io/2023/03/11/version-2.11.4.html" rel="alternate" type="text/html" title="Web Client 2.11.4" /><published>2023-03-11T18:25:00+02:00</published><updated>2023-03-11T18:25:00+02:00</updated><id>https://airdcpp-web.github.io/2023/03/11/version-2.11.4</id><content type="html" xml:base="https://airdcpp-web.github.io/2023/03/11/version-2.11.4.html"><![CDATA[<!--more-->

<h2 id="changelog">Changelog</h2>

<h2 id="web-client-2114">Web Client 2.11.4</h2>

<ul>
  <li>Fix temp share item detection in private chat</li>
  <li>Fix broken list filtering after the current directory was reloaded in own filelist</li>
  <li>Improve logging of partial filelist transfers</li>
  <li>Portable builds: build with Buildroot 2023.02</li>
</ul>

<h3 id="web-ui-2115">Web UI 2.11.5</h3>

<ul>
  <li>Fix emoji URLs by updating dependencies</li>
  <li>Make message author and other text dropdown captions copyable (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/442">#442</a>)</li>
  <li>Ensure that the sidebar won’t remain larger than the window after resizing</li>
  <li>Fix table column resizing while the table data is being updated (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/444">#444</a>)</li>
  <li>Fix possible table-related crashes (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/443">#443</a>)</li>
</ul>

<h2 id="download-links-linux"><a href="/docs/installation/linux-binaries.html">Download links (Linux)</a></h2>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">Web Client 2.11.3</title><link href="https://airdcpp-web.github.io/2022/12/02/version-2.11.3.html" rel="alternate" type="text/html" title="Web Client 2.11.3" /><published>2022-12-02T19:55:00+02:00</published><updated>2022-12-02T19:55:00+02:00</updated><id>https://airdcpp-web.github.io/2022/12/02/version-2.11.3</id><content type="html" xml:base="https://airdcpp-web.github.io/2022/12/02/version-2.11.3.html"><![CDATA[<!--more-->

<h2 id="changelog">Changelog</h2>

<h3 id="web-client-2113">Web Client 2.11.3</h3>

<ul>
  <li>Fix UTF-8 conversion in NMDC CTM NAT traversal reverse reply (<a href="https://github.com/airdcpp/airdcpp-windows/pull/66">airdcpp-windows#66</a>)</li>
  <li>Report certain incorrectly forwarded ADC protocol messages</li>
  <li>Remove warnings for old LuaDCH version</li>
  <li>Disable maximum size for shared files when using the RAR profile</li>
  <li>Don’t ignore filenames containing semicolons in SFV files (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/424">#424</a>)</li>
  <li>SOCKS5: don’t fail if the proxy server doesn’t send any port for regular connect attempts</li>
  <li>Filelist API: fix crashes when submitting directory paths without the trailing slash</li>
  <li>Build: fix deprecation warnings with the latest OpenSSL version</li>
  <li>Build: fix a build error on ARM macOS</li>
  <li>Build: define HAVE_POSIX_FADVISE correctly (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/425">#425</a>)</li>
  <li>Portable builds: build with Buildroot 2022.02</li>
</ul>

<h3 id="web-ui-2114">Web UI 2.11.4</h3>

<ul>
  <li>New notifications library</li>
  <li>Add missing dupe coloring for chat highlights (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/431">#431</a>)</li>
  <li>Fix visual artifacts while the sidebar is being opened</li>
  <li>Search options: fix a crash when loading previously set size limits</li>
  <li>Search options: remember the previously selected hubs even after visiting other pages</li>
  <li>Update dependencies</li>
  <li>Set a matching tab bar color when using Safari 15</li>
</ul>

<h2 id="download-links-linux"><a href="/docs/installation/linux-binaries.html">Download links (Linux)</a></h2>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry><entry><title type="html">Web Client 2.11.2</title><link href="https://airdcpp-web.github.io/2021/09/19/version-2.11.2.html" rel="alternate" type="text/html" title="Web Client 2.11.2" /><published>2021-09-19T11:25:00+03:00</published><updated>2021-09-19T11:25:00+03:00</updated><id>https://airdcpp-web.github.io/2021/09/19/version-2.11.2</id><content type="html" xml:base="https://airdcpp-web.github.io/2021/09/19/version-2.11.2.html"><![CDATA[<!--more-->

<p><strong>Note:</strong></p>

<p>Portable binaries now require Linux kernel 3.10 or newer</p>

<h2 id="changelog">Changelog</h2>

<h3 id="web-client-2112">Web Client 2.11.2</h3>

<ul>
  <li>Fix filelist-related crashes</li>
  <li>Fix a possible crash when uploading files (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/405">#405</a>)</li>
  <li>Search API: match the file extension for incoming NMDC results (<a href="https://github.com/airdcpp-web/airdcpp-webclient/issues/406">#406</a>)</li>
  <li>Search API: fix owner IDs for search instances created by basic auth sessions</li>
  <li>Filesystem API: avoid socket timeouts when listing directory content</li>
  <li>API: fix an incorrectly returned error status code when removing hooks</li>
  <li>API: fix a missing error message when removing non-existing subscriptions</li>
  <li>SOCKS5: fix sending of UDP data when connecting to the SOCKS server via IPv4</li>
  <li>Print more information in console when the application crashes</li>
</ul>

<h3 id="web-ui-2112">Web UI 2.11.2</h3>

<ul>
  <li>Fix moving of widgets</li>
</ul>

<h2 id="download-links-linux"><a href="/docs/installation/linux-binaries.html">Download links (Linux)</a></h2>]]></content><author><name>maksis</name></author><summary type="html"><![CDATA[]]></summary></entry></feed>`;
