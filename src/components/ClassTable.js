import { memo } from 'react'
import { isObject } from '@/utils/isObject'
import { castArray } from '@/utils/castArray'
import clsx from 'clsx'
import { Heading } from '@/components/Heading'

function stringifyProperties(
  properties,
  { filter = () => true, transformValue = (x) => x, indent = 0 } = {}
) {
  let lines = []
  Object.keys(properties).forEach((property) => {
    if (isObject(properties[property])) {
      lines.push(`${property} {`)
      lines.push(
        stringifyProperties(properties[property], { filter, transformValue, indent: indent + 1 })
      )
      lines.push('}')
    } else {
      castArray(properties[property]).forEach((value, i) => {
        if (!filter(property, value, properties)) return
        lines.push(`${'  '.repeat(indent)}${property}: ${transformValue(value)};`)
      })
    }
  })
  return lines.join('\n')
}

export const ClassTable = memo(
  ({
    classes = {},
    filterProperties,
    preview,
    transformSelector = (x) => x,
    transformProperties = ({ properties }) => properties,
    transformValue,
    custom,
  }) => {
    return (
      <div className="mt-0 border-t border-b border-gray-300 overflow-hidden relative">
        <Heading
          level={2}
          id="class-reference"
          toc={true}
          className="relative"
          style={{ top: '-100vh' }}
        >
          <span className="sr-only">Class reference</span>
        </Heading>
        <div
          className={clsx(
            'overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch',
            { 'lg:max-h-xs': Object.keys(classes).length > 12 }
          )}
        >
          {custom || (
            <table className="w-full text-left table-collapse">
              <thead>
                <tr>
                  <th className="z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0">
                    <div className="p-2 border-b border-gray-300">Class</div>
                  </th>
                  <th
                    className={`z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0 ${
                      preview && 'hidden sm:table-cell'
                    }`}
                  >
                    <div className="p-2 border-b border-gray-300">Properties</div>
                  </th>
                  {preview && (
                    <th className="z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0">
                      <div className="p-2 border-b border-gray-300">
                        <span className="sr-only">Preview</span>&nbsp;
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="align-baseline">
                {Object.keys(classes).map((utility, i) => {
                  let selector = utility
                  let properties = classes[selector]

                  return (
                    <tr key={utility}>
                      <td
                        className={`p-2 font-mono text-xs text-purple-700 whitespace-no-wrap ${
                          i === 0 ? '' : 'border-t border-gray-200'
                        }`}
                      >
                        {transformSelector(selector)}
                      </td>
                      <td
                        className={`p-2 font-mono text-xs text-blue-700 whitespace-pre ${
                          i === 0 ? '' : 'border-t border-gray-200'
                        } ${preview && 'hidden sm:table-cell'}`}
                      >
                        {stringifyProperties(transformProperties({ selector, properties }), {
                          filter: filterProperties,
                          transformValue,
                        })}
                      </td>
                      {preview &&
                        preview(properties, {
                          className: i === 0 ? '' : 'border-t border-gray-200',
                        })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }
)
