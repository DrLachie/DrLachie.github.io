---
layout: default
title: Events
---
# Events

AusBIAS organises monthly meetings, usually online, where often one member will lead discussion of a paper, method, or problem of the day. We are also involved in hosting training courses at our various institutions, and supporting local conferences.
<h2>Upcoming Events</h2>

<ul>
{% assign today = 'now' | date: '%Y-%m-%d' %}
{% assign upcoming_events = site.data.events | sort: 'date' %}
{% for event in site.data.events %}
  {% if event.date >= today %}
    <li style="margin-bottom: 2em;">
        {% if event.logo %}
          <img src="{{ event.logo | relative_url }}" alt="{{ event.title }} logo" style="height: 50px; vertical-align: middle;">
        {% endif %}>
      <strong>{{ event.title }}</strong> – {{ event.date }} – {{ event.location }}<br>
      <a href="{{ event.url }}" target="_blank">More info</a>
      <p>{{ event.description }}</p>
    </li>
  {% endif %}
{% endfor %}
</ul>

<h2>Past Events</h2>

<ul>
{% assign today = 'now' | date: '%Y-%m-%d' %}
{% assign past_events = site.data.events | sort: 'date' | reverse %}
{% for event in site.data.events %}
  {% if event.date < today %}
    <li>
      <strong>{{ event.title }}</strong> – {{ event.date }} – {{ event.location }}<br>
      <a href="{{ event.url }}" target="_blank">More info</a>
      <p>{{ event.description }}</p>
    </li>
  {% endif %}
{% endfor %}
</ul>
