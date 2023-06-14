

import { cookies } from 'next/headers';
import { getAPIClient } from '@/utils/webflow_helper';
import { generateMetadataSuggestionsAndAnalysis } from '@/utils/openai_helper';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('id');
  const cookieStore = cookies();
  const webflowAuth = cookieStore.get('webflow_auth').value;
  const webflowAPI = getAPIClient(webflowAuth);
  const {
    seo,
    openGraph,
    ...pageDetails
  } = await webflowAPI.page({pageId});

  let res;
  try {
    res = await generateMetadataSuggestionsAndAnalysis(
      seo.title,
      seo.description,
      openGraph.title,
      openGraph.description,
    );
  } catch (error) {
    console.error('Error generating metadata suggestions and analysis:', error);
    res = {
      seoTitleAnalysis: null,
      seoTitleSuggestions: null,
      seoDescriptionAnalysis: null,
      seoDescriptionSuggestions: null,
      openGraphTitleAnalysis: null,
      openGraphTitleSuggestions: null,
      openGraphDescriptionAnalysis: null,
      openGraphDescriptionSuggestions: null,
    };
  }

  const pageData = {
    ...pageDetails,
    seo: {
      title: seo.title,
      titleAnalysis: res.seoTitleAnalysis,
      titleSuggestions: res.seoTitleSuggestions,
      description: seo.description,
      descriptionAnalysis: res.seoDescriptionAnalysis,
      descriptionSuggestions: res.seoDescriptionSuggestions,
    },
    openGraph: {
      title: openGraph.title,
      titleCopied: openGraph.titleCopied,
      titleAnalysis: res.openGraphTitleAnalysis,
      titleSuggestions: res.openGraphTitleSuggestions,
      description: openGraph.description,
      descriptionCopied: openGraph.descriptionCopied,
      descriptionAnalysis: res.openGraphDescriptionAnalysis,
      descriptionSuggestions: res.openGraphDescriptionSuggestions,
    },
  };

  return Response.json(pageData);
}
