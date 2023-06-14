/**
 * Concatenates multiple class names into a single string and returns it.
 * 
 * @param {...string} classes - The class names to concatenate.
 * @returns {string} A string containing all the class names separated by spaces.
 */
export function classNames(...classes) {
  // Use the filter() method to remove any falsy values from the classes array.
  // This allows the function to handle conditional class names like:
  //    className={classNames('button', isLoading && 'loading')}
  // In this example, if isLoading is false, the second argument to classNames()
  // will be falsy and filtered out, so only the 'button' class name will be used.
  const filteredClasses = classes.filter(Boolean);
  
  // Use the join() method to concatenate the remaining class names into a
  // single string with spaces between them.
  return filteredClasses.join(' ');
}

/**
 * Calculates the time difference between a given timestamp (in ISO 8601 format
 * or Unix timestamp in seconds) and the current time, and returns a string that
 * says how long ago the timestamp was (e.g. "2 hours ago").
 * 
 * @param {string|number} timestamp - The timestamp to convert, in ISO 8601 format
 * or Unix timestamp in seconds.
 * @returns {string} A string that says how long ago the timestamp was.
 */
export function timeAgo(timestamp) {
  // Create Date objects for the current time and the timestamp
  const now = new Date();
  const then = new Date(timestamp);
  
  // Calculate the time difference in milliseconds
  const diff = Math.max(now.getTime() - then.getTime(), 0);
  
  // Calculate the time difference in seconds, minutes, hours, days, weeks,
  // months, and years, and return a string that says how long ago the
  // timestamp was.
  const secondsAgo = Math.floor(diff / 1000);
  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo === 1) {
    return 'yesterday';
  }
  if (daysAgo < 7) {
    return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  }
  
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo === 1) {
    return '1 week ago';
  }
  if (weeksAgo < 4) {
    return `${weeksAgo} weeks ago`;
  }
  
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo === 1) {
    return '1 month ago';
  }
  if (monthsAgo < 12) {
    return `${monthsAgo} months ago`;
  }
  
  const yearsAgo = Math.floor(daysAgo / 365);
  if (yearsAgo === 1) {
    return '1 year ago';
  }
  return `${yearsAgo} years ago`;
}

/**
 * Formats a timestamp (in ISO 8601 format or Unix timestamp in seconds) as a
 * human-readable string that can be used as the `title` attribute for an HTML
 * element.
 *
 * @param {string|number} timestamp - The timestamp to format, in ISO 8601 format
 * or Unix timestamp in seconds.
 * @returns {string} A formatted string that can be used as the `title` attribute.
 */
export function getTitleTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

/**
 * The dedent function removes extra indentation from multiline strings.
 * It takes a tagged template literal as its argument, which consists of
 * an array of strings and an array of values (from expressions embedded
 * within the template literal).
 *
 * @param {TemplateStringsArray} strings - An array of strings from the template literal.
 * @param {...any} values - The values of expressions embedded within the template literal.
 * @returns {string} - A dedented string with the extra indentation removed.
 *
 * @example
 * const exampleString = dedent`
 *   This is an example string.
 *     This line has extra indentation.
 * `;
 * console.log(exampleString);
 * // Output:
 * // This is an example string.
 * //   This line has extra indentation.
 */
export function dedent(strings, ...values) {
  // Concatenate the strings and values arrays into a single string (fullString)
  let fullString = strings.reduce((result, string, i) => {
    return result + (values[i - 1] || '') + string;
  }, '');

  // Split the fullString into an array of lines
  let lines = fullString.split('\n');

  // Determine the minimum indentation level (minIndent) by filtering out empty lines
  // and finding the position of the first non-space character for each line
  let minIndent = Math.min(
    ...lines
      .filter(line => line.trim().length > 0)
      .map(line => line.search(/\S/))
  );

  // Remove the extra indentation from each line by slicing off the minIndent amount
  // of characters and join the lines back into a single string
  let dedentedString = lines
    .map(line => line.slice(minIndent))
    .join('\n')
    .trim();

  return dedentedString;
}

/**
 * A base64-encoded SVG placeholder image.
 * This image is a 200x200 light gray (#EEEEEE) rectangle that serves as
 * a simple and lightweight placeholder for the Next.js Image component.
 * It will be displayed with a blur effect while the main image is being
 * downloaded.
 *
 * @type {string}
 * @example
 * <Image
 *   src={mainImageUrl}
 *   alt=""
 *   width={400}
 *   height={300}
 *   placeholder="blur"
 *   blurDataURL={placeholderImage}
 * />
 */
export const placeholderImage =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjwvc3ZnPg==";

/**
 * Truncates and formats a domain name to display it in a user-friendly/Webflow way.
 *
 * @param {string} domainName - The domain name to format, without the protocol (e.g., "example.com").
 * @returns {string} - The formatted domain name.
 * @example
 * const domainName = "reallylongsubdomain.example.com";
 * const formattedDomainName = formatDomainName(domainName);
 * console.log(formattedDomainName); // Outputs "reallylongsu...example.com" 
 */
export function formatDomainName(domainName) {
  // Split the domain name into parts by using the '.' delimiter.
  const parts = domainName.split(".");

  // Extract the first part (subdomain) and the remaining parts (domain and TLD).
  const firstPart = parts[0];
  const remainingParts = parts.slice(1).join(".");

  // Define the maximum length allowed for the first part (subdomain).
  const maxLength = 15;

  // Initialize a variable to store the truncated first part.
  let truncatedFirstPart = firstPart;

  // If the first part is longer than the maximum allowed length,
  // truncate it and add an ellipsis (...) at the end.
  if (firstPart.length > maxLength) {
    truncatedFirstPart = `${firstPart.slice(0, maxLength - 3)}...`;
  }

  // Return the formatted domain name by concatenating the truncated first part
  // and the remaining parts.
  return `${truncatedFirstPart}.${remainingParts}`;
}

export const getFunFact = () => {
  const funFacts = [
    'Did you know? The first website was published on August 6, 1991!',
    'Fun fact: There are over 1.7 billion websites on the internet!',
    'Joke time: Why did the SEO expert go broke? Because she put all her money on organic traffic!',
    'Interesting tidbit: The most visited website in the world is Google!',
    'Guess what? Around 380 new websites are created every minute!',
    'Fun fact: The average person spends 6 hours and 42 minutes on the internet every day!',
    'Did you know? The first email was sent in 1971 by computer engineer Ray Tomlinson!',
    'Interesting tidbit: The first domain name ever registered was Symbolics.com!',
    'Joke time: Why do web developers always carry a spare pair of glasses? Because they like to have a backup for their CSS!',
    'Did you know? The first search engine, Archie, was created in 1990, two years before the World Wide Web!',
    'Fun fact: The most expensive domain name ever sold was Cars.com for $872 million!',
    'Interesting tidbit: The average page load time for a website is 3 seconds!',
    'Joke time: Why did the computer go to art school? Because it wanted to learn how to draw a better bitmap!',
    'Guess what? More than 90% of all internet traffic is encrypted!',
    'Fun fact: The inventor of the World Wide Web, Sir Tim Berners-Lee, originally called it "Mesh"!',
    'Did you know? The term "World Wide Web" was coined by Tim Berners-Lee in 1989!',
    'Joke time: Why was the computer cold at the office? It left its Windows open!',
    'Interesting tidbit: As of 2021, there are over 4.9 billion internet users!',
    'Guess what? China has the largest number of internet users, followed by India and the United States!',
    'Fun fact: The internet is actually a massive collection of interconnected networks called the Internet Protocol Suite!'
  ];

  return funFacts[Math.floor(Math.random() * funFacts.length)];
};