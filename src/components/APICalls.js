const organization = "Dummy-Organ";
const acceptLabel = "syn-accepted";

export const PRAPI = `https://api.github.com/search/issues?q=org:${organization}+is:pr+is:merged+label:"${acceptLabel}"`;

export const issueAPI = `https://api.github.com/search/issues?q=org:${organization}+is:issue+label:"${acceptLabel}"`;
