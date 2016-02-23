class CaseStudy < ActiveRecord::Base

  default_scope { order('created_at ASC') }

  before_validation :check_slug, on: [:create, :update]

  acts_as_taggable

  has_many :contacts
  has_many :pages
  belongs_to :organization
  has_attached_file :cover_image, styles: {
    medium: '385x200#',
    large: '1920x1080#'
  }

  validates :title, presence: true, length: { minimum: 2, maximum: 100 }
  validates_uniqueness_of :slug
  validates :lat, presence: true
  validates :lng, presence: true
  validates :template, presence: true, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 5
  }
  validates_inclusion_of :published, in: [true, false]
  validates_attachment_content_type :cover_image, content_type: /\Aimage\/.*\Z/

  accepts_nested_attributes_for :contacts, reject_if: :all_blank, allow_destroy: true

  attr_accessor :delete_image

  def delete_image= delete_image
    self.cover_image.clear if delete_image == "true"
  end

  def self.published
    where(published: true)
  end

  def self.find_published(slug)
    find_by(slug: slug, published: true)
  end

  def self.where_published(params)
    where(params.merge(published: true))
  end

  def self.with_pages
    includes(:pages)
  end

  def self.clone(id)
    include_these = [
      :contacts,
      { pages: [ :interest_points, :data_layers, :charts ] }
    ]
    c_study = find(id).deep_clone(include: include_these) do |orig, kopy|
      kopy.slug = orig.slug+"-"+Time.now.to_i.to_s if kopy.respond_to?(:slug)
      kopy.cloning = true if kopy.respond_to?(:file)
      kopy.cover_image = orig.cover_image if kopy.respond_to?(:cover_image)
      kopy.background = orig.background if kopy.respond_to?(:background)
      kopy.logo = orig.logo if kopy.respond_to?(:logo)
    end
    c_study
  end

  def self.get_tag_filtered(options={})
    case_studies = CaseStudy.all
    case_studies = case_studies.tagged_with(options[:tags]) if options[:tags]
    case_studies
  end

  def self.search(search)
    where("title ILIKE ?", "%#{search}%")
  end

private
  def check_slug
    if self.slug.blank?
      self.slug = self.title.parameterize
    end
  end


end
