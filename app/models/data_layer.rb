class DataLayer < ActiveRecord::Base

  include CartoDb

  REQUIRED_HEADERS = []

  belongs_to :page
  delegate :column_selected, to: :page

  validates :table_name, presence: true
  validates :import_status, presence: true
  validates :year, presence: true

  attr_accessor :file

  before_validation :create_file

  def create_file
    # return false unless valid_file_headers?(file)
    if self.file.present?
      import_status = DataLayer.import_file(self.file)
      self.table_name = import_status['table_name']
      self.import_status = import_status['state']
      self
    end
  end

  private

    def valid_file_headers?(file)
      required_headers = indicators_names + REQUIRED_HEADERS
      stripped_headers = CSV.read(file.path, headers: true).headers.map(&:strip)
      (required_headers - stripped_headers).empty?
    end

    def self.import_file(file)
      queue_id = CartoDb.upload(file)
      sleep(1) # give CartoDB time to do its thing
      logger.info "My queue id is #{queue_id}"
      i = 0
      import_status = CartoDb.import_status(queue_id)
      while i < 10
        return import_status if import_status["state"] == "complete"
        sleep(5)
        import_status = CartoDb.import_status(queue_id)
        i += 1
        logger.info "Upload not done yet. will wait a bit longer. This was try number #{i}"
      end
      false # cos it was never complete
    end

end
