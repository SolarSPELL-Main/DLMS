from django_filters import FilterSet, BaseInFilter, NumberFilter
from django.db.models import ManyToManyField, ForeignKey, SmallIntegerField

from content_management.models import Content


class NumberInFilter(BaseInFilter, NumberFilter):
    pass


class ContentsFilterSet(FilterSet):
    class Meta:
        model = Content
        fields = {
            'name': ['icontains'],
            'description': ['icontains'],
            'updated_time': ['lte', 'gte'],
            'creators': ['in'],
            'coverage': ['in'],
            'subjects': ['in'],
            'keywords': ['in'],
            'workareas': ['in'],
            'language': ['in'],
            'cataloger': ['in'],
            'active': ['exact']
        }

    @classmethod
    def filter_for_lookup(cls, f, lookup_type):
        # override in lookups
        if (isinstance(f, ManyToManyField) or isinstance(f, ForeignKey)) and lookup_type == 'in':
            return NumberInFilter, {}

        if (isinstance(f, SmallIntegerField) and lookup_type == 'exact'):
            return NumberFilter, {}

        # use default behavior otherwise
        return super().filter_for_lookup(f, lookup_type)
