// Maximum number of rows for which "select all" is offered.
//
// Selecting all requires fetching every matching row from the API (the view
// store only holds the visible window), and each selected item is queued with
// its own API request. The server processes those on a small shared task pool
// (web_server_threads / 2, two threads by default), so a large selection would
// block unrelated API work for as long as it takes to drain.
//
// The checkbox is disabled above this limit; narrowing the view with the text
// or dupe filters is the intended way to get under it.
export const MAX_SELECT_ALL_ITEMS = 50;
