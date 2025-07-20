let iconCache: {
  simple?: string[];
  devicon?: string[];
} = {};

function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, '');
}

async function fetchCollections() {
  if (iconCache.simple && iconCache.devicon) return;

  const [simple, devicon] = await Promise.all([
    fetch("https://api.iconify.design/collection?prefix=simple-icons").then((r) => r.json()),
    fetch("https://api.iconify.design/collection?prefix=devicon-plain").then((r) => r.json()),
  ]);

  iconCache.simple = simple.uncategorized;
  iconCache.devicon = devicon.uncategorized;
}

export async function getTechIcon(name: string): Promise<string> {
  const normalized = normalize(name);
  const deviconPlain = `${normalized}`;

  await fetchCollections();

  if (iconCache.simple?.includes(normalized)) {
    return `simple-icons:${normalized}`;
  } else if (iconCache.devicon?.includes(deviconPlain)) {
    return `devicon-plain:${deviconPlain}`;
  }

  return "mdi:alert-circle"; // fallback
}
