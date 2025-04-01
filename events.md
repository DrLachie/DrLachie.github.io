---
layout: default
title: Events
---

<h2>Upcoming Events</h2>

<ul>
{% assign today = 'now' | date: '%Y-%m-%d' %}
{% for event in site.data.events %}
  {% if event.date >= today %}
    <li>
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
