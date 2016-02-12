class CaseStudySerializer < ActiveModel::Serializer
  attributes :id, :case_path, :cover_path, :title, :lat, :lng

  has_many :pages

  def cover_path
    object.cover_image.url(:medium)
  end
  def case_path
    case_study_path(object.slug)
  end
end
