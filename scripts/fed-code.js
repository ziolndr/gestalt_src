const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// List of agencies and their code.json URLs
const agencies = [
  {
    name: "Department of Agriculture",
    url: "https://www.usda.gov/code.json",
    organizations: ["GrainGenes", "usda", "usda-ars-agil", "usda-ars-gbru", "usda-ars-ltar", "usda-ars-nwrc", "usda-ars-wmsru", "USDA-ERS", "USDA-FSA", "USDA-NIFA", "usda-vs", "usdaForestService", "WFMRDA"]
  },
  {
    name: "Department of Commerce",
    url: "https://www.commerce.gov/code.json",
    organizations: ["businessusa", "commercedataservice", "commercegov", "internationaltradeadministration", "ioos", "nesii", "NMML", "noaa-gfdl", "NOAA-ORR-ERD", "ntia", "SelectUSA", "us-bea", "uscensusbureau", "useda", "USPTO", "XDgov"]
  },
  {
    name: "Department of Defense",
    url: "https://www.code.mil/code.json",
    organizations: ["adl-aicc", "adlnet", "afrl", "afseo", "deptofdefense", "erdc-itl", "iadgov", "info-sharing-environment", "M-O-S-E-S", "missioncommand", "NationalGuard", "NationalSecurityAgency", "ngageoint", "nsacyber", "project-interoperability", "psns-imf", "redhawksdr", "screamlab", "usarmyresearchlab", "USNavalResearchLaboratory", "virtual-world-framework"]
  },
  {
    name: "Department of Education",
    url: "https://www.ed.gov/code.json",
    organizations: ["USDepartmentOfEducation"]
  },
  {
    name: "Department of Energy",
    url: "https://www.energy.gov/code.json",
    organizations: ["AMO-NETL", "lbnl", "NREL", "PREDICTS"]
  },
  {
    name: "Department of Health and Human Services",
    url: "https://www.hhs.gov/code.json",
    organizations: ["CDCgov", "FDA", "National-Cancer-Institute", "nih", "ninds", "US-CMS"]
  },
  {
    name: "Department of Homeland Security",
    url: "https://www.dhs.gov/code.json",
    organizations: ["dhs"]
  },
  {
    name: "Department of Housing and Urban Development",
    url: "https://www.hud.gov/code.json",
    organizations: ["HUDUser"]
  },
  {
    name: "Department of Justice",
    url: "https://www.justice.gov/code.json",
    organizations: ["DOJgov", "FBI"]
  },
  {
    name: "Department of Labor",
    url: "https://www.dol.gov/code.json",
    organizations: ["BLS"]
  },
  {
    name: "Department of State",
    url: "https://www.state.gov/code.json",
    organizations: ["DOS"]
  },
  {
    name: "Department of the Interior",
    url: "https://www.doi.gov/code.json",
    organizations: ["BLM", "Bureau-of-Reclamation", "USGS"]
  },
  {
    name: "Department of Transportation",
    url: "https://www.transportation.gov/code.json",
    organizations: ["dot-gov", "USDOT"]
  },
  {
    name: "Department of Treasury",
    url: "https://www.treasury.gov/code.json",
    organizations: ["USTreasury"]
  },
  {
    name: "Department of Veterans Affairs",
    url: "https://www.va.gov/code.json",
    organizations: ["deptvetaffairs"]
  },
  {
    name: "Environmental Protection Agency",
    url: "https://www.epa.gov/code.json",
    organizations: ["EPA"]
  },
  {
    name: "General Services Administration",
    url: "https://www.gsa.gov/code.json",
    organizations: ["GSA"]
  },
  {
    name: "National Aeronautics and Space Administration",
    url: "https://www.nasa.gov/code.json",
    organizations: ["NASA"]
  },
  {
    name: "National Science Foundation",
    url: "https://www.nsf.gov/code.json",
    organizations: ["NationalScienceFoundation"]
  },
  {
    name: "Nuclear Regulatory Commission",
    url: "https://www.nrc.gov/code.json",
    organizations: ["NRCgov"]
  },
  {
    name: "Office of Management and Budget",
    url: "https://www.whitehouse.gov/omb/code.json",
    organizations: ["omb"]
  },
  {
    name: "Office of Personnel Management",
    url: "https://www.opm.gov/code.json",
    organizations: ["USOPM"]
  },
  {
    name: "Small Business Administration",
    url: "https://www.sba.gov/code.json",
    organizations: ["SBAgov"]
  },
  {
    name: "Smithsonian Institution",
    url: "https://www.si.edu/code.json",
    organizations: ["Smithsonian"]
  },
  {
    name: "Social Security Administration",
    url: "https://www.ssa.gov/code.json",
    organizations: ["SocialSecurityAdministration"]
  }
];

async function fetchJson(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function fetchAndCombineData() {
  const combinedData = [];

  for (const agency of agencies) {
    const agencyData = await fetchJson(agency.url);
    if (agencyData && agencyData.releases) {
      const projects = agencyData.releases.map(project => ({
        name: project.name,
        description: project.description,
        repositoryURL: project.repositoryURL,
        license: project.permissions && project.permissions.licenses ? project.permissions.licenses.map(license => license.name) : [],
        organization: project.organization,
        tags: project.tags
      }));

      combinedData.push({
        agencyName: agency.name,
        organizations: agency.organizations,
        projects: projects
      });
    }
  }

  // Save combined data to fed-code.json in the project root
  const outputPath = path.join(process.cwd(), 'fed-code.json');
  await fs.writeFile(outputPath, JSON.stringify(combinedData, null, 2));
  console.log('Combined data saved to fed-code.json');
}

fetchAndCombineData().catch(console.error);