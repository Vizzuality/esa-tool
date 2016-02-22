module CartoDb

  include HTTMultiParty

  default_timeout 120

  USERNAME = Rails.application.secrets.cartodb['username']
  API_KEY = Rails.application.secrets.cartodb['api_key']

  base_uri URI::HTTPS.build(
    host: "#{USERNAME}.cartodb.com",
    path: '/api/'
  ).to_s

  def self.query(sql)
    JSON.parse(rows_for(sql))['rows']
  end

  def self.upload(file)
    JSON.parse(upload_file(file))["item_queue_id"]
  end

  def self.import_status(queue_id)
    JSON.parse(check_import_status(queue_id))
  end

  private

    def self.rows_for(sql)
      post('/v2/sql/',
        query: { api_key: API_KEY },
        body: { q: sql }
      ).body
    end

    def self.upload_file(file)
      post('/v1/imports/',
        query: {
          api_key: API_KEY,
          file: file,
          privacy: "link"
        }
      ).body
    end

    def self.check_import_status(queue_id)
      get("/v1/imports/#{queue_id}?api_key=#{API_KEY}").body
    end

end
