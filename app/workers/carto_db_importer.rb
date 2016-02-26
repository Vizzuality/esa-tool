class CartoDbImporter
  @queue = :carto_table_import
  def self.perform(data_layer_id)
    layer = DataLayer.find(data_layer_id)

    if Rails.env.development?
      # read from local
      file = File.open(layer.shapefile.path)
    else
      # get file from s3 in production env
      s3file = layer.shapefile.url
      file_name = Rails.root.join('tmp', layer.shapefile_file_name)

      File.open(file_name, 'wb') do |fo|
        fo.write(open(s3file).read)
      end

      file = File.open(file_name)

    end

    queue_id = CartoDb.upload(file)
    sleep(10)
    import_status = CartoDb.import_status(queue_id)
    i = 0
    while i < 120
      break if import_status["state"] == "complete"
      layer.update_attributes(import_status: "uploading")
      sleep(60)
      import_status = CartoDb.import_status(queue_id)
      i += 1
    end
    layer.update_attributes(import_status: import_status["state"])
    layer.update_attributes(table_name: import_status["table_name"])
    layer.shapefile.destroy
    layer.shapefile.clear

    File.delete(file) unless Rails.env.development?
  end
end
