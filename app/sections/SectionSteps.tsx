import {Image, type ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';
import type {SectionStepsFragment} from 'storefrontapi.generated';
import {Badge, badgeColors} from '~/components/badge';

export function SectionSteps(props: SectionStepsFragment) {
  const section = parseSection<
    SectionStepsFragment,
    {
      title: ParsedMetafields['single_line_text_field'];
      headings: ParsedMetafields['list.single_line_text_field'];
      labels: ParsedMetafields['list.single_line_text_field'];
      icons: ParsedMetafields['list.file_reference'];
      contents: ParsedMetafields['list.single_line_text_field'];
    }
  >(props);

  const {title, headings, labels, contents, icons, style} = section;

  return (
    <section 
      className="section-steps container"
      aria-labelledby="section-steps-title"
    >
      <h1 id="section-steps-title" className="sr-only">
        {title?.value || 'Our company values section'}
      </h1>
      <div
        className={
          style?.value === '1'
            ? 'py-24 lg:py-32 border-t border-b border-slate-200'
            : ''
        }
      >
        <div 
          className="relative grid sm:grid-cols-3  gap-10 sm:gap-16 xl:gap-20"
          role="list">
          {headings ? headings.parsedValue?.map((item, index) => (
            <article
              key={`${index + item}`}
              className="relative flex flex-col items-center max-w-xs mx-auto"
              role="listitem"
              aria-labelledby={`step-title-${index}`}
              aria-describedby={`step-content-${index}`}
            >
              <div className="mb-4 sm:mb-10 max-w-[140px] mx-auto">
                {!!icons?.nodes?.[index]?.image && (
                  <Image
                    className="rounded-3xl"
                    data={icons?.nodes[index].image || {}}
                    sizes="250px"
                  />
                )}
              </div>
              <div className="text-center space-y-5">
                <h2 
                  id={`step-title-${index}`}
                  className="text-lg font-semibold"
                >
                  {item}
                </h2>
                <p 
                  id={`step-content-${index}`}
                  className="block text-sm leading-6"
                >
                  {contents?.parsedValue?.[index]}
                </p>
              </div>
            </article>
          ))
          :
          <>
            {icons?.nodes?.map((item, index) => (
              <article
                key={`${index}`}
                className="relative flex flex-col items-center mx-auto w-full"
                role="listitem"
                aria-label={`Step ${index + 1}`}
              >
                <div className="mb-4 sm:mb-10 mx-auto w-full">
                  <Image
                    data={item.image || {}}
                    sizes="350px"
                  />
                </div>
              </article>
            ))}
          </>
          }
        </div>
      </div>
    </section>
  );
}

export const SECTION_STEPS_FRAGMENT = `#graphql
  fragment SectionSteps on Metaobject {
    type
    title: field(key: "title") {
      type
      key
      value
    }
    headings: field(key: "headings") {
      type
      key
      value
    }
    labels: field(key: "labels") {
      type
      key
      value
    }
    contents: field(key: "contents") {
      type
      key
      value
    }
    icons: field(key: "icons") {
      key
      type
      value
      references(first: 10) {
        nodes {
              ...MediaImage
            }
        }
    }
    style: field(key: "style") {
      key
      value
    }
  }
`;
