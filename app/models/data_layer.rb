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
                    "application/octet-stream"] #for .shp files



  validates :shapefile, attachment_presence: true
  # validates :table_name, presence: true
  # validates :import_status, presence: true
  # validates :year, presence: true

  attr_accessor :cloning

  after_save :upload_carto_file, on: :create, unless: :cloning

  before_destroy :remove_cartodb_table

  def remove_cartodb_table
    layers_same_table = DataLayer.where.not(id: self.id).where(table_name: self.table_name)
    if layers_same_table.empty?
      CartoDb.remove_cartodb_table(self.table_name)
    end
  end

  def upload_carto_file
    Resque.enqueue(CartoDbImporter, self.id) if self.table_name.blank?
  end

end
