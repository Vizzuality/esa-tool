class DataLayer < ActiveRecord::Base

  include CartoDb

  REQUIRED_HEADERS = []

  belongs_to :page

  has_attached_file :shapefile
  validates_attachment_content_type :shapefile,
    content_type: ["text/csv",
                    "application/vnd.ms-excel",
                    "application/zip",
                    "application/vnd.google-earth.kml+xml",
                    "application/gpx",
                    "application/gpx+xml",
                    #for .shp files
                    "application/octet-stream"]



  validates :shapefile, attachment_presence: true
  # validates :table_name, presence: true
  # validates :import_status, presence: true
  # validates :year, presence: true

  attr_accessor :cloning

  # before_validation :create_file, on: :create, unless: :cloning

  before_destroy :remove_cartodb_table

  def create_file
    if self.file.present?
      import_status = DataLayer.import_file(self.file)
      self.table_name = import_status['table_name']
      self.import_status = import_status['state']
      self
    else
      self.errors[:file] = "You need to provide a file"
    end
  end

  def remove_cartodb_table
    layers_same_table = DataLayer.where.not(id: self.id).where(table_name: self.table_name)
    if layers_same_table.empty?
      CartoDb.remove_cartodb_table(self.table_name)
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
