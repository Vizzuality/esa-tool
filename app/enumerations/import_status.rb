class ImportStatus < EnumerateIt::Base
  associate_values :pending, :uploading, :failure, :complete
end
