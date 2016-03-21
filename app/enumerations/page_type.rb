class PageType < EnumerateIt::Base
  associate_values(
    text: 1,
    timeline: 2,
    map: 3
  )
end
